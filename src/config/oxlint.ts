// oxlint-disable typescript/no-explicit-any

import type {
    IOXLintConfig,
    IResolveConfigMeta,
    IResolveConfigPath,
    IResolveLinterConfigRules,
} from '#shared/types/types' // loading use lint rules
import type { ESLint } from 'eslint'
import type { ExternalPluginEntry, OxlintConfig } from 'oxlint'
import type { IOxlintRules, oxlintRuleMeta } from 'oxlint-rules-meta'
import { interopDefault } from '@antfu/eslint-config'
import { isObject } from '@vueuse/core'
import c from 'ansis'
import { getRuleMeta } from 'oxlint-rules-meta'
import { x } from 'tinyexec'
import { MARK_INFO } from '../constants'

// loading use lint rules config
function resolveConfigRules(config: OxlintConfig): IResolveConfigMeta[] {
    const configs = new Map<string, IResolveConfigMeta>()

    if (config.rules) {
        const globalRules: IResolveConfigMeta = {
            name: 'oxlint/global/rules',
            rules: config.rules,
        }

        if (config.plugins) {
            globalRules.plugins = config.plugins
        }

        if (config.jsPlugins) {
            globalRules.plugins = Object.values({
                ...globalRules.plugins,
                ...config.jsPlugins.map((p: ExternalPluginEntry) => (isObject(p) ? p.specifier : p)),
            }) as string[]
        }

        configs.set('oxlint/global/rules', globalRules)
    }

    if (config.ignorePatterns) {
        configs.set('oxlint/ignorePatterns', {
            name: 'oxlint/ignorePatterns',
            ignores: config.ignorePatterns,
        })
    }

    if (config.overrides) {
        config.overrides.forEach((override, index) => {
            const name = `oxlint/overrides/${index + 1}`
            const tempConfigs: IResolveConfigMeta = {
                name,
            }

            if (override.files) {
                tempConfigs.files = override.files
            }

            if (override.rules) {
                tempConfigs.rules = override.rules
            }

            if (override.plugins) {
                tempConfigs.plugins = override.plugins
            }

            if (override.jsPlugins) {
                tempConfigs.plugins = Object.values({
                    ...tempConfigs.plugins,
                    ...override.jsPlugins.map((p: ExternalPluginEntry) => (isObject(p) ? p.specifier : p)),
                }) as string[]
            }

            configs.set(name, tempConfigs)
        })
    }

    return Array.from(configs.values())
}

// loading config use plugins
function resolveConfigPlugins(config: OxlintConfig): ExternalPluginEntry[] {
    const plugins = new Set<ExternalPluginEntry>()

    if (config.jsPlugins) {
        config.jsPlugins.forEach((plugin: ExternalPluginEntry) => {
            plugins.add(plugin)
        })
    }

    if (config.overrides) {
        config.overrides.forEach((override) => {
            if (override.jsPlugins) {
                override.jsPlugins.forEach((plugin: ExternalPluginEntry) => {
                    plugins.add(plugin)
                })
            }
        })
    }

    return Array.from(plugins)
}

// Load all the rule data information that is used.
async function resolveLinterRules(
    linterRules: IOxlintRules[],
    plugins: ExternalPluginEntry[],
): Promise<IResolveLinterConfigRules> {
    const rules = new Map<string, any>()
    linterRules.forEach((r) => {
        const { meta } = getRuleMeta(r.value as keyof typeof oxlintRuleMeta)
        rules.set(r.value, {
            name: r.value,
            type: 'oxc',
            source: meta.source,
            fixable: meta.fixable,
            docs: {
                description: meta.docs.description,
                url: meta.docs.url,
            },
            defaultOptions: meta.defaultOptions,
            schema: meta.schema,
        })
    })

    const parsePluginRules = async (plugin: string) => {
        const module = (await interopDefault(import(plugin))) as ESLint.Plugin

        for (const [rule, ruleMeta] of Object.entries(module?.rules ?? [])) {
            rules.set(rule, {
                name: rule,
                type: 'plugin',
                source: plugin,
                fixable: ruleMeta.meta?.fixable ?? '',
                docs: {
                    description: ruleMeta?.meta?.docs?.description ?? '',
                    url: ruleMeta?.meta?.docs?.url ?? '',
                },
                defaultOptions: ruleMeta?.meta?.defaultOptions ?? [],
                schema: ruleMeta?.meta?.schema ?? [],
            })
        }
    }
    for (const plugin of plugins) {
        if (isObject(plugin)) {
            await parsePluginRules(plugin.specifier)
        }
        else {
            await parsePluginRules(plugin)
        }
    }

    return Object.fromEntries(rules.entries())
}

export async function resolveOXLintConfig(options: IResolveConfigPath): Promise<IOXLintConfig> {
    const { basePath, lintConfigPath } = options

    console.log(MARK_INFO, `Reading Oxc Linter config from`, c.blue(lintConfigPath))

    const rawLinterRules = await x('oxlint', ['--rules', '-f', 'json'], {
        nodeOptions: {
            cwd: basePath,
        },
    })

    const rawLinterConfigs = JSON.parse(
        await x('oxlint', ['--print-config', '-f', 'json'], {
            nodeOptions: {
                cwd: basePath,
            },
        }).then(r => r.stdout.trim()),
    ) as OxlintConfig

    const plugins = resolveConfigPlugins(rawLinterConfigs)

    const rules = await resolveLinterRules(JSON.parse(rawLinterRules.stdout.trim()), plugins)

    const configs = resolveConfigRules(rawLinterConfigs)

    return {
        plugins,
        configs,
        rules,
    }
}
