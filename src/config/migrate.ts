import type { FlatConfigItem, IResolveConfigPath, oxlintScene, oxlintScenMeta } from '~~/shared/types/types'
import migrate from '@oxlint/migrate'
import { OXLintMigrateReporter } from '~~/src/reporter'

const oxlintMigrateScene: oxlintScenMeta = {
    native: {
        withNursery: false,
        typeAware: false,
        jsPlugins: false,
    },
    default: {
        withNursery: false,
        typeAware: false,
        jsPlugins: true,
    },
    max: {
        withNursery: false,
        typeAware: false,
        jsPlugins: true,
    },
}

export async function migrateScene(scene: oxlintScene, configs: FlatConfigItem[]) {
    const reporter = new OXLintMigrateReporter()

    const config = await migrate(configs, undefined, {
        reporter,
        merge: false,
        ...oxlintMigrateScene[scene],
    })

    return {
        config,
        warning: reporter.getWarnings(),
        skippedRules: reporter.getSkippedRulesByCategory(),
    }
}

export async function resolveSceneConfig(config: FlatConfigItem[]) {
    return {
        native: await migrateScene('native', config),
        default: await migrateScene('default', config),
        max: await migrateScene('max', config),
    }
}

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

    const shippedRules = reporter.getSkippedRulesByCategory()

    return {
        config,
        shippedRules,
        'nursery': shippedRules.nursery,
        'not-implemented': shippedRules['not-implemented'],
        'unsupported': shippedRules.unsupported,
    }
}
