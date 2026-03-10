import type { ILinterInspectorPayload, IResolveConfig } from './types'
import { writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import c from 'ansis'
import { resolveConfig, resolveConfigPath, resolveEslintRulesConfig, resolveOXLintConfig } from './config'
import { MARK_INFO } from './constants'
import { ConfigInspectorError } from './error'

async function readConfig(options: IResolveConfig): Promise<ILinterInspectorPayload> {
    let resolvedConfigPath: Awaited<ReturnType<typeof resolveConfigPath>>

    try {
        resolvedConfigPath = await resolveConfigPath(options)
    }
    catch (error) {
        if (error instanceof ConfigInspectorError) {
            error.prettyPrint()
            process.exit(1)
        }
        throw error
    }

    const {
        basePath,
        lintConfigPath,
        formatConfigPath,
        eslintConfigPath,
        linterVersion,
        formatVersion,
    } = resolvedConfigPath
    console.log(resolvedConfigPath)

    const oxlint = await resolveOXLintConfig(resolvedConfigPath)

    if (formatConfigPath) {
        console.log(MARK_INFO, `Reading Oxc Format config from`, c.blue(formatConfigPath))
    }

    const eslintConfig = await resolveEslintRulesConfig(resolvedConfigPath)

    return {
        oxlint,
        oxfmt: {
            // current .oxfmt.json
            config: {},
            // default oxfmt rule option
            rules: {},
        },
        eslint: {
            // current eslint.config.{j,t,mj,mt}s
            config: eslintConfig.configs,
            // default eslint config
            rules: eslintConfig.rules,
        },
        meta: {
            version: {
                oxlint: linterVersion,
                oxfmt: formatVersion,
            },
            lastUpdate: Date.now(),
            basePath,
            lintConfigPath,
            formatConfigPath,
            eslintConfigPath,
        },
    }
}

readConfig(resolveConfig()).then((r) => {
    console.log(r)
    writeFileSync(
        resolve(r.meta.basePath, 'oxc-inspector.meta.json'),
        JSON.stringify(r, null, 2),
        'utf-8',
    )
})
