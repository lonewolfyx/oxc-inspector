import type { IPackageExitisMeta, IProjectEnv, IResolveConfigPath, IResolveProjectConfig } from '#shared/types/types'
import { getPackageInfo, isPackageExists } from 'local-pkg'
import { readPackageJSON } from 'pkg-types'

async function getProjectEnv(options: IResolveConfigPath): Promise<IProjectEnv> {
    const { basePath } = options

    const packageExits = async (name: string): Promise<IPackageExitisMeta> => {
        const exists = isPackageExists(name, { paths: [basePath] })
        const version = exists ? await getPackageInfo(name).then(r => r?.version ?? '') : ''
        return {
            exists,
            version,
        }
    }

    return {
        vue: await packageExits('vue'),
        nuxt: await packageExits('nuxt'),
        vitepress: await packageExits('vitepress'),
        react: await packageExits('react'),
        nextjs: await packageExits('nextjs'),
        astro: await packageExits('astro'),
        nitro: await packageExits('nitro'),
        // preact: await packageExits('preact'),
        lit: await packageExits('lit'),
        svelte: await packageExits('svelte'),
        solid: await packageExits('solid'),
        // ember: await packageExits('ember'),
        // qwik: await packageExits('qwik'),
        angular: await packageExits('angular'),
        // marko: await packageExits('marko'),
        electron: await packageExits('electron'),

        tailwindcss: await packageExits('tailwindcss'),
        unocss: await packageExits('unocss'),

        eslint: await packageExits('eslint'),
        prettier: await packageExits('prettier'),
        typescript: await packageExits('typescript'),
        jest: await packageExits('jest'),
        vitest: await packageExits('vitest'),
        oxlint: await packageExits('oxlint'),
        oxfmt: await packageExits('oxfmt'),

        shadcn: await packageExits('shadcn'),
        shadcnVue: (await packageExits('shadcn-nuxt')) || (await packageExits('reka-ui')),
    }
}

export async function getProjectConfig(options: IResolveConfigPath): Promise<IResolveProjectConfig> {
    const packageData = await readPackageJSON()

    return {
        package: {
            name: packageData.name ?? '',
            version: packageData.version ?? '',
            description: packageData.description ?? '',
            dependencies: packageData.dependencies ?? {},
            devDependencies: packageData.devDependencies ?? {},
        },
        env: await getProjectEnv(options),
    }
}
