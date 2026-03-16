// because @oxlint/migrate not export types,so we copy
import type { OxlintConfig as OxlintConfigInternal } from 'oxlint'

export type RuleSkippedCategory
    = | 'nursery'
        | 'type-aware'
        | 'not-implemented'
        | 'unsupported'
        | 'js-plugins'

export type SkippedCategoryGroup = Record<RuleSkippedCategory, string[]>

export interface Reporter {
    addWarning: (message: string) => void
    getWarnings: () => string[]
    markSkipped: (rule: string, category: RuleSkippedCategory) => void
    removeSkipped: (rule: string, category: RuleSkippedCategory) => void
    getSkippedRulesByCategory: () => SkippedCategoryGroup
}

export type OxlintCategory = 'style' | 'correctness' | 'nursery' | 'suspicious' | 'pedantic' | 'perf' | 'restriction'

export type OxlintConfigEnv = Record<string, boolean>

export type OxlintConfigCategories = Record<OxlintCategory, boolean>

export type OxlintSupportedSettingsKey = 'jsx-a11y' | 'next' | 'react' | 'jsdoc' | 'vitest'

export type OxlintSettings = { [K in OxlintSupportedSettingsKey]?: Record<string, unknown> } & Record<string, Record<string, unknown> | undefined>

interface OxlintOptions {
    typeAware?: boolean
    typeCheck?: boolean
}

export interface OxlintConfigOverride {
    files: string[]
    env?: OxlintConfigEnv
    globals?: ESLint.GlobalsConfig
    plugins?: string[]
    jsPlugins?: string[]
    categories?: OxlintConfigCategories
    rules?: Partial<ESLint.RulesRecord>
}

export type MigrateOxlintConfig = Omit<OxlintConfigInternal, 'overrides'> & {
    $schema?: string
    overrides?: OxlintConfigOverride[]
}
