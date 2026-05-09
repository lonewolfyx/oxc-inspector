import c from 'ansis'

export const lintConfigFilenames = ['.oxlintrc.json', '.oxlintrc.jsonc', 'oxlint.config.ts']

export const formatConfigFilenames = ['.oxfmtrc.json', '.oxfmtrc.jsonc', 'oxfmt.config.ts']

export const eslintConfigFilenames = [
    'eslint.config.js',
    'eslint.config.mjs',
    'eslint.config.cjs',
    'eslint.config.ts',
    'eslint.config.mts',
    'eslint.config.cts',
]

export const LintPluginOptions = [
    'eslint',
    'react',
    'unicorn',
    'typescript',
    'oxc',
    'import',
    'jsdoc',
    'jest',
    'vitest',
    'jsx-a11y',
    'nextjs',
    'react-perf',
    'promise',
    'node',
    'vue',
]

export const MARK_CHECK = c.green('✔')
export const MARK_INFO = c.blue('ℹ')
export const MARK_ERROR = c.red('✖')
