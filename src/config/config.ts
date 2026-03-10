import type { IResolveConfig, IResolveConfigPath } from '../types'
import { resolve } from 'node:path'
import process from 'node:process'
import { findUp } from 'find-up'
import { dirname, normalize } from 'pathe'
import { eslintConfigFilenames, formatConfigFilenames, lintConfigFilenames } from '../constants'
import { getFmtVersion, getLintVersion } from '../utils/version'

export function resolveConfig(): IResolveConfig {
    return {
        cwd: process.cwd(),
    }
}

export async function resolveConfigPath(options: IResolveConfig): Promise<IResolveConfigPath> {
    const { cwd } = options

    const lintConfigPath
        = (await findUp(lintConfigFilenames, {
            cwd,
        })) ?? ''

    const formatConfigPath
        = (await findUp(formatConfigFilenames, {
            cwd,
        })) ?? ''

    const eslintConfigPath
        = (await findUp(eslintConfigFilenames, {
            cwd,
        })) ?? ''

    const basePath = normalize(
        dirname(lintConfigPath || formatConfigPath || eslintConfigPath || resolve(cwd, '../')),
    )

    return {
        basePath,
        lintConfigPath,
        formatConfigPath,
        eslintConfigPath,
        linterVersion: await getLintVersion(),
        formatVersion: await getFmtVersion(),
    }
}
