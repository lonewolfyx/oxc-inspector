// oxlint-disable typescript/no-explicit-any

import type { RuleMetaData } from '@typescript-eslint/utils/ts-eslint'
import type { Linter } from 'eslint'
import type { JSONSchema4 } from 'json-schema'
import type { AllowWarnDeny, DummyRule, DummyRuleMap, ExternalPluginEntry } from 'oxlint'

export type SeverityValue = 'off' | 'warn' | 'error'

export interface ErrorInfo {
    error: string
    message?: string
}

export interface IResolveConfig {
    cwd: string
}

export interface IResolveConfigPath {
    basePath: string
    lintConfigPath: string
    formatConfigPath: string
    eslintConfigPath: string
    linterVersion: string
    formatVersion: string
}

export interface FlatConfigItem extends Linter.Config {
    index: number
}

export interface RuleInfo extends RuleMetaData<any, any> {
    name: string
    plugin: string
    /**
     * The rule may be removed
     */
    invalid?: boolean
}

export interface ESLintConfig {
    configs: FlatConfigItem[]
    rules: Record<string, RuleInfo>
    dependencies: string[]
}

export interface IRulesMeta {
    name: string
    type: string
    source: string
    fixable: string
    docs: {
        description: string
        url: string
    }
    defaultOptions: unknown[]
    schema: JSONSchema4
    options?: unknown[]
    severity?: AllowWarnDeny[]
}

export type LintPluginOptionsSchema
    = | 'eslint'
        | 'react'
        | 'unicorn'
        | 'typescript'
        | 'oxc'
        | 'import'
        | 'jsdoc'
        | 'jest'
        | 'vitest'
        | 'jsx-a11y'
        | 'nextjs'
        | 'react-perf'
        | 'promise'
        | 'node'
        | 'vue'

export interface IResolveConfigMeta {
    name: string
    rules?: DummyRuleMap
    plugins?: LintPluginOptionsSchema[] | ExternalPluginEntry[] | null
    ignores?: string[]
    files?: string[]
}

export interface IResolveConfigRules {
    [k: string]: {
        level: AllowWarnDeny
        options?: DummyRule[]
        meta: RuleInfo
    }
}

export interface IResolveLinterConfigRules {
    [k: string]: IRulesMeta
}

export interface IOXLintConfig {
    plugins: ExternalPluginEntry[]
    configs: IResolveConfigMeta[]
    rules: IResolveLinterConfigRules
}

export interface IPackageExitisMeta {
    exists: boolean
    version: string
}

export type ProjectFrameworks = 'vue'
    | 'nuxt'
    | 'vitepress'
    | 'react'
    | 'nextjs'
    | 'astro'
    | 'nitro'
    | 'lit'
    | 'svelte'
    | 'solid'
    | 'angular'
    | 'electron'
    | 'tailwindcss'
    | 'unocss'
    | 'eslint'
    | 'prettier'
    | 'typescript'
    | 'jest'
    | 'vitest'
    | 'oxlint'
    | 'oxfmt'
    | 'shadcn'
    | 'shadcnVue'

export type IProjectEnv = Record<ProjectFrameworks, IPackageExitisMeta>

export interface IResolveProjectConfig {
    package: {
        name: string
        version: string
        description: string
        dependencies: Record<string, string>
        devDependencies: Record<string, string>
    }
    env: IProjectEnv
}

export type oxlintScene = 'native' | 'default' | 'max'

export type oxlintScenMeta = Record<oxlintScene, {
    withNursery: boolean
    typeAware: boolean
    jsPlugins: boolean
}>
