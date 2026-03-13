import type { ILinterInspectorPayload } from '#shared/types/inspector'
import type { IResolveConfigPath } from '#shared/types/types'
import {
    getProjectConfig,
    resolveEslintRulesConfig,
    resolveOXFormatConfig,
    resolveOXLintConfig,
} from './config'

export async function readConfig(
    resolvedConfigPath: IResolveConfigPath,
): Promise<ILinterInspectorPayload> {
    const {
        basePath,
        lintConfigPath,
        formatConfigPath,
        eslintConfigPath,
        linterVersion,
        formatVersion,
    } = resolvedConfigPath

    const projects = await getProjectConfig(resolvedConfigPath)

    const oxfmt = await resolveOXFormatConfig(resolvedConfigPath)

    const oxlint = await resolveOXLintConfig(resolvedConfigPath)

    const eslintConfig = await resolveEslintRulesConfig(resolvedConfigPath)

    return {
        projects,
        oxlint,
        oxfmt,
        eslint: {
            configs: eslintConfig.configs,
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

// const options = await resolveConfigPath(resolveConfig())
// readConfig(options).then((r) => {
//     console.log(r)
//     writeFileSync(
//         resolve(r.meta.basePath, 'oxc-inspector.meta.json'),
//         JSON.stringify(r, null, 2),
//         'utf-8',
//     )
// })
