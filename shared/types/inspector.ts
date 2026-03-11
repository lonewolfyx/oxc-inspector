import type { FormatOptions } from 'oxfmt'
import type { Ref, ShallowRef } from 'vue'
import type { ESLintConfig, IOXLintConfig } from '~~/src/types'

export interface IFormatOverRides {
    excludeFiles: string[]
    files: string[]
    options: FormatOptions
}

export interface IFormatOptions extends FormatOptions {
    overrides?: IFormatOverRides[]
}

export type IFormatConfigOptions = FormatOptions | IFormatOverRides

export type IFormatConfigMeta = IFormatConfigOptions & {
    name: string
}

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
    payload?: ShallowRef<ILinterInspectorPayload>
}
