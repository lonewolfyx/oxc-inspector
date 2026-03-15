import migrate from '@oxlint/migrate'
import { describe, expect, it } from 'vitest'
import { resolveConfigPath, resolveEslintRulesConfig } from '../src/config'
import { OXLintMigrateReporter } from '../src/reporter'

describe('oxlint migrate test', () => {
    it('should loading eslint config path ', async () => {
        const { eslintConfigPath } = await resolveConfigPath({
            cwd: process.cwd(),
        })
        expect(eslintConfigPath).toMatch('eslint.config.mjs')
    })

    it('should load migrate eslint data ', async () => {
        const eslint = await resolveEslintRulesConfig(await resolveConfigPath({
            cwd: process.cwd(),
        }))
        const reporter = new OXLintMigrateReporter()
        const config = await migrate(eslint.configs, undefined, {
            reporter,
            merge: false,
            withNursery: true,
            typeAware: true,
            jsPlugins: true,
        })
        console.log(config)
        console.log(reporter.getWarnings())
        console.log(reporter.getSkippedRulesByCategory())
    })
})
