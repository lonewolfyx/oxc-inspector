import type { ESLintConfig, FlatConfigItem, IResolveConfigPath, RuleInfo } from '../types'
import c from 'ansis'
import { bundleRequire } from 'bundle-require'
import { resolve as resolveModule } from 'mlly'
import { MARK_INFO } from '../constants'

const defaultESLinter: FlatConfigItem[] = [
    {
        index: 1,
        name: 'eslint/defaults/languages',
        languageOptions: {
            sourceType: 'module',
            ecmaVersion: 'latest',
            parserOptions: {},
        },
        linterOptions: {
            reportUnusedDisableDirectives: 1,
        },
    },
    {
        index: 2,
        name: 'eslint/defaults/ignores',
        ignores: ['**/node_modules/', '.git/'],
    },
    {
        index: 3,
        name: 'eslint/defaults/files',
        files: ['**/*.js', '**/*.mjs'],
    },
    {
        index: 4,
        name: 'eslint/defaults/files-cjs',
        files: ['**/*.cjs'],
        languageOptions: {
            sourceType: 'commonjs',
            ecmaVersion: 'latest',
        },
    },
]

/**
 * Search and read the ESLint config file, processed into inspector payload with module dependencies
 *
 * @sourceFrom https://github.com/eslint/config-inspector/blob/main/src/configs.ts
 * @param options
 */
export async function resolveEslintRulesConfig(options: IResolveConfigPath): Promise<ESLintConfig> {
    const { basePath, eslintConfigPath } = options
    if (eslintConfigPath) {
        console.log(MARK_INFO, `Reading Eslint config from`, c.blue(eslintConfigPath))

        const { mod, dependencies } = await bundleRequire({
            cwd: basePath,
            filepath: eslintConfigPath,
            tsconfig: false,
        })
        // console.log(await (mod.default ?? mod))
        // console.log(dependencies)

        let rawConfigs = (await (mod.default ?? mod)) as FlatConfigItem[]

        // A single flat config object is also valid
        if (!Array.isArray(rawConfigs))
            rawConfigs = [rawConfigs]

        // ESLint applies these default configs to all files
        // https://github.com/eslint/eslint/blob/21d3766c3f4efd981d3cc294c2c82c8014815e6e/lib/config/default-config.js#L66-L69
        rawConfigs.unshift(...defaultESLinter)

        const rulesMap = new Map<string, RuleInfo>()

        // Try resolve `eslint` module from the same directory as the config file
        // Otherwise fallback to bare import
        const eslintPath
            = (await resolveModule('eslint/use-at-your-own-risk', { url: basePath }).catch(() => null))
                || 'eslint/use-at-your-own-risk'

        const eslintRules = await import(eslintPath).then(r => r.default.builtinRules)

        for (const [name, rule] of eslintRules.entries()) {
            rulesMap.set(name, {
                ...((rule as any).meta as any),
                name,
                plugin: 'eslint',
                schema: undefined,
                messages: undefined,
            })
        }

        for (const item of rawConfigs) {
            for (const [prefix, plugin] of Object.entries(item.plugins ?? {})) {
                for (const [name, rule] of Object.entries(plugin.rules ?? {})) {
                    rulesMap.set(`${prefix}/${name}`, {
                        ...(rule as any).meta as any,
                        name: `${prefix}/${name}`,
                        plugin: prefix,
                        schema: undefined,
                        messages: undefined,
                    })
                }
            }
        }

        const rules = Object.fromEntries(rulesMap.entries())
        const configs = rawConfigs.map((c, idx): FlatConfigItem => {
            return {
                ...c,
                index: idx,
                plugins: c.plugins
                    ? Object.fromEntries(
                            Object.entries(c.plugins ?? {})
                                .map(([prefix]) => [prefix, {}])
                                .filter(i => i[0]),
                        )
                    : undefined,
                languageOptions: c.languageOptions
                    ? {
                            ...c.languageOptions,
                            parser: (c.languageOptions.parser as any)?.meta?.name as any,
                        }
                    : undefined,
                processor: (c.processor as any)?.meta?.name,
            }
        })

        return {
            configs,
            rules,
            dependencies,
        }
    }

    return {
        configs: [],
        rules: {},
        dependencies: [],
    }
}
