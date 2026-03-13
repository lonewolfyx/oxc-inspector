import type { FormatOptions } from 'oxfmt'
import type { ComputedRef, Ref, ShallowRef } from 'vue'
import type { ErrorInfo, ESLintConfig, IOXLintConfig, IResolveProjectConfig } from './types'

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

export interface IConfigInspectorMeta {
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

export interface ILinterInspectorPayload {
    projects: IResolveProjectConfig
    oxlint: IOXLintConfig
    oxfmt: IFormatConfigMeta[] | null
    eslint: Omit<ESLintConfig, 'dependencies'>
    meta: IConfigInspectorMeta
}

export interface IConfigInspector {
    errorInfo: Ref<ErrorInfo>
    loading: Ref<boolean>
    payload?: ShallowRef<ILinterInspectorPayload>
    oxLinter: ComputedRef
    oxFormat: ComputedRef<IFormatConfigMeta[] | null>
    metaOptions: ComputedRef<IConfigInspectorMeta>
    oxRules: ComputedRef
}
