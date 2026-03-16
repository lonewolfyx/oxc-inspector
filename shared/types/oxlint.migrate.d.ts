// because @oxlint/migrate not export types,so we copy
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
