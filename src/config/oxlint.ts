// oxlint-disable typescript/no-explicit-any

import type { ESLint } from 'eslint'
import type { DummyRule, ExternalPluginEntry, OxlintConfig } from 'oxlint'
import type { IOxlintRules, oxlintRuleMeta } from 'oxlint-rules-meta'
import type { IOXLintConfig, IResolveConfigPath, IResolveConfigRules, IResolveLinterConfigRules } from '../types'
import { interopDefault } from '@antfu/eslint-config'
import { isObject } from '@vueuse/core'
import c from 'ansis'
import { getRuleMeta } from 'oxlint-rules-meta'
import { x } from 'tinyexec'
import { MARK_INFO } from '../constants'

function getRuleLevel(level: DummyRule) {
    const first = Array.isArray(level) ? level[0] : level

    switch (first) {
        case 0:
            return 'off'
        case 1:
            return 'warn'
        case 2:
            return 'error'
        default:
            return first
    }
}

// loading use lint rules
function resolveConfigRules(
    config: OxlintConfig,
    rawRules: IResolveLinterConfigRules,
): IResolveConfigRules {
    const rules = new Map<string, any>()
    const mergeRules = (configs: any) => {
        Object.entries(configs).forEach(([rule, dummyRule]) => {
            if (!rules.has(rule)) {
                rules.set(rule, [])
            }
            rules.get(rule)!.push({
                level: getRuleLevel(dummyRule as DummyRule),
                options: Array.isArray(dummyRule) ? dummyRule.slice(1) : {},
                meta: rawRules[rule] ?? rawRules[rule.split('/').pop()],
            })
        })
    }
    if (config.rules) {
        mergeRules(config.rules)
    }

    if (config.overrides) {
        config.overrides.forEach((override) => {
            if (override.rules) {
                mergeRules(override.rules)
            }
        })
    }

    return Object.fromEntries(rules.entries())
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
            defaultOptions: meta.schema ?? [],
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

    const configs = resolveConfigRules(rawLinterConfigs, rules)

    return {
        plugins,
        configs,
        rules,
    }
}
