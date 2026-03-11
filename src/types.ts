// oxlint-disable typescript/no-explicit-any

import type { RuleMetaData } from '@typescript-eslint/utils/ts-eslint'
import type { Linter } from 'eslint'
import type { JSONSchema4 } from 'json-schema'
import type { AllowWarnDeny, DummyRule, ExternalPluginEntry } from 'oxlint'

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
    configs: IResolveConfigRules
    rules: IResolveLinterConfigRules
}

export interface ILinterInspectorPayload {
    oxlint: IOXLintConfig
    oxfmt: {
        config: object
        rules: object
    }
    eslint: Omit<ESLintConfig, 'dependencies'>
    meta: {
        version: {
            oxlint: string
            oxfmt: string
        }
        lastUpdate: number
        basePath: string
        lintConfigPath: string
        formatConfigPath: string
        eslintConfigPath: string
    }
}
