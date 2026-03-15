import type { FlatConfigItem, IResolveConfigPath } from '~~/shared/types/types'
import migrate from '@oxlint/migrate'
import { OXLintMigrateReporter } from '~~/src/reporter'

export async function resolveEslintMigrateConfig(options: IResolveConfigPath, eslintConfig: FlatConfigItem[]) {
    if (!options.eslintConfigPath) {
        return {}
    }
    const reporter = new OXLintMigrateReporter()

    const config = await migrate(eslintConfig, undefined, {
        reporter,
        merge: false,
        withNursery: true,
        typeAware: true,
        jsPlugins: true,
    })

    console.log(config)
    return {

    }
}
