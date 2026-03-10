import type { RuleMetaData } from '@typescript-eslint/utils/ts-eslint'
import type { Linter } from 'eslint'

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
