import type { IFormatConfigMeta, IFormatOptions, IResolveConfigPath } from '~~/src/types'
import { readFile } from 'node:fs/promises'
import c from 'ansis'
import defu from 'defu'
import { MARK_INFO } from '../constants'

const defaultFormatOptions: IFormatOptions = {
    arrowParens: 'always',
    bracketSameLine: false,
    bracketSpacing: true,
    embeddedLanguageFormatting: 'auto',
    endOfLine: 'lf',
    htmlWhitespaceSensitivity: 'css',
    ignorePatterns: [],
    insertFinalNewline: true,
    jsxSingleQuote: false,
    objectWrap: 'preserve',
    overrides: [],
    proseWrap: 'preserve',
    quoteProps: 'as-needed',
    semi: true,
    singleAttributePerLine: false,
    singleQuote: false,
    sortImports: {},
    sortPackageJson: true,
    sortTailwindcss: {},
}

/**
 * Resolve OXFormat config
 * @param options
 */
export async function resolveOXFormatConfig(options: IResolveConfigPath): Promise<IFormatConfigMeta[] | null> {
    const { formatConfigPath } = options
    if (!formatConfigPath) {
        return null
    }

    console.log(MARK_INFO, `Reading Oxc Format config from`, c.blue(formatConfigPath))

    const rawFormat = JSON.parse(await readFile(formatConfigPath, 'utf-8')) as IFormatOptions
    if (rawFormat.$schema) {
        delete rawFormat.$schema
    }

    const rawConfigs = defu(rawFormat, defaultFormatOptions)
    const configs = new Map<string, IFormatConfigMeta>()
    if (rawConfigs.overrides) {
        rawConfigs.overrides?.forEach((override, index) => {
            const name = `oxfmt/override/${index + 1}`
            configs.set(name, {
                name,
                ...override,
            })
        })
        delete rawConfigs.overrides
    }

    configs.set('oxfmt/default', {
        name: 'oxfmt/global/default',
        options: rawConfigs,
    })

    return Array.from(configs.values())
}
