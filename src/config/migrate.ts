import type { MigrateOxlintConfig, RuleSkippedCategory } from '#shared/types/oxlint.migrate'
import type {
    ESLintConfig,
    FlatConfigItem,
    IMigrateScene,
    IResolveConfigPath,
    IResolveEslintMigrateConfig,
    IResolveSceneConfig,
    oxlintScene,
    oxlintScenMeta,
} from '~~/shared/types/types'
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

export async function migrateScene(scene: oxlintScene, configs: FlatConfigItem[]): Promise<IMigrateScene> {
    const reporter = new OXLintMigrateReporter()

    const config = await migrate(configs, undefined, {
        reporter,
        merge: false,
        ...oxlintMigrateScene[scene],
    }) as MigrateOxlintConfig

    return {
        config,
        warning: reporter.getWarnings(),
        skippedRules: reporter.getSkippedRulesByCategory(),
    }
}

export async function resolveSceneConfig(config: FlatConfigItem[]): Promise<IResolveSceneConfig> {
    return {
        native: await migrateScene('native', config),
        default: await migrateScene('default', config),
        max: await migrateScene('max', config),
    }
}

const CATEGORY_MAP = {
    typeAware: 'type-aware',
    nursery: 'nursery',
    unsupported: 'unsupported',
    notImplemented: 'not-implemented',
    jsPlugins: 'js-plugins',
} as const

function disciplineMigrateRules(sceneConfig: IMigrateScene[]) {
    const aggregateRules = (scenes: IMigrateScene[], category: RuleSkippedCategory): Record<string, string> => {
        return scenes.reduce((acc, scene) => ({
            ...acc,
            ...scene.skippedRules[category],
        }), {})
    }

    return Object.entries(CATEGORY_MAP).reduce((config, [apiKey, ruleKey]) => {
        config[apiKey] = aggregateRules(sceneConfig, ruleKey)
        return config
    }, {} as Record<string, Record<string, string>>)
}

export async function resolveEslintMigrateConfig(options: IResolveConfigPath, eslintConfig: ESLintConfig): Promise<IResolveEslintMigrateConfig> {
    if (!options.eslintConfigPath) {
        return {}
    }

    const sceneConfig = await resolveSceneConfig(eslintConfig.configs)

    return {
        sceneConfig,
        migrateConfig: disciplineMigrateRules(Object.values(sceneConfig)),
    }
}
