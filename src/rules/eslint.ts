import type { IResolveConfigPath } from '../types'
import c from 'ansis'
import { bundleRequire } from 'bundle-require'
import { MARK_INFO } from '../constants'

export async function resolveEslintRulesConfig(options: IResolveConfigPath): Promise<object> {
    const { basePath, eslintConfigPath } = options
    if (eslintConfigPath) {
        console.log(MARK_INFO, `Reading Eslint config from`, c.blue(eslintConfigPath))

        const { mod, dependencies } = await bundleRequire({
            cwd: basePath,
            filepath: eslintConfigPath,
            tsconfig: false,
        })
        console.log(await (mod.default ?? mod))
        console.log(dependencies)
    }

    return {}
}
