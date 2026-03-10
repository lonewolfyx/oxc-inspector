import c from 'ansis'

export const lintConfigFilenames = [
    '.oxlintrc.json',
    '.oxlintrc.jsonc',
    'oxlint.config.ts',
]

export const formatConfigFilenames = [
    '.oxfmtrc.json',
]

export const eslintConfigFilenames = [
    'eslint.config.js',
    'eslint.config.mjs',
    'eslint.config.cjs',
    'eslint.config.ts',
    'eslint.config.mts',
    'eslint.config.cts',
]
export const MARK_CHECK = c.green('✔')
export const MARK_INFO = c.blue('ℹ')
export const MARK_ERROR = c.red('✖')
