import type { Ref, ShallowRef } from 'vue'
import type { ESLintConfig, IFormatConfigMeta, IOXLintConfig } from '~~/src/types'

export interface ILinterInspectorPayload {
    oxlint: IOXLintConfig
    oxfmt: IFormatConfigMeta[] | null
    eslint: Omit<ESLintConfig, 'dependencies'>
    meta: {
        version: {
            oxlint: string
            oxfmt: string
        }
        lastUpdate: number
        basePath: string
        lintConfigPath: string
        formatConfigPath: string
        eslintConfigPath: string
    }
}

export interface IConfigInspector {
    loading: Ref<boolean>
    payload: ShallowRef<ILinterInspectorPayload>
}
