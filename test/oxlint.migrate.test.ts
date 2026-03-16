import { describe, expect, it } from 'vitest'
import {
    resolveConfigPath,
    resolveEslintMigrateConfig,
    resolveEslintRulesConfig,
    resolveSceneConfig,
} from '../src/config'

describe('oxlint migrate test', () => {
    it('should loading eslint config path ', async () => {
        const { eslintConfigPath } = await resolveConfigPath({
            cwd: process.cwd(),
        })
        expect(eslintConfigPath).toMatch('eslint.config.mjs')
    })

    it('should load migrate eslint data ', async () => {
        const options = await resolveConfigPath({
            cwd: process.cwd(),
        })
        const eslint = await resolveEslintRulesConfig(options)

        const migrateConfig = await resolveEslintMigrateConfig(options, eslint)

        expect(migrateConfig).toMatchFileSnapshot(`./migrate.json`)
        // console.log(reporter.getWarnings())
        // console.log(reporter.getSkippedRulesByCategory())
    })

    it('resolve oxlint migrate config ', async () => {
        const options = await resolveConfigPath({
            cwd: process.cwd(),
        })
        const eslint = await resolveEslintRulesConfig(options)
        const migrate = await resolveSceneConfig(eslint.configs)
        expect(migrate).toMatchFileSnapshot('./migrate.scene.json')
    })
})
