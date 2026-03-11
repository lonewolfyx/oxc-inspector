// oxlint-disable typescript/no-explicit-any

import type { RuleMetaData } from '@typescript-eslint/utils/ts-eslint'
import type { Linter } from 'eslint'
import type { JSONSchema4 } from 'json-schema'
import type { FormatOptions } from 'oxfmt'
import type { AllowWarnDeny, DummyRule, DummyRuleMap, ExternalPluginEntry } from 'oxlint'

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
}

type LintPluginOptionsSchema
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

export interface IFormatOverRides {
    excludeFiles: string[]
    files: string[]
    options: FormatOptions
}

export interface IFormatOptions extends FormatOptions {
    overrides?: IFormatOverRides[]
}

export type IFormatConfigOptions = FormatOptions | IFormatOverRides

export type IFormatConfigMeta = IFormatConfigOptions & {
    name: string
}
