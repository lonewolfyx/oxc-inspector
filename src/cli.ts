import { existsSync } from 'node:fs'
import fs from 'node:fs/promises'
import process from 'node:process'
import { intro, log } from '@clack/prompts'
import c from 'ansis'
import cac from 'cac'
import chalk from 'chalk'
import { getPort } from 'get-port-please'
import open from 'open'
import { relative, resolve } from 'pathe'
import { glob } from 'tinyglobby'
import { resolveConfigPath } from '~~/src/config'
import { readConfig } from '~~/src/configs'
import { MARK_CHECK, MARK_INFO } from '~~/src/constants'
import { distDir } from '~~/src/dirs'
import { ConfigInspectorError } from '~~/src/error'
import { createHostServer } from '~~/src/server'
import { description, version } from '../package.json' with { type: 'json' }

const cli = cac('Oxc inspector')

// source from eslint inspector
cli
    .command('build', 'Build inspector with current config file for static hosting')
    .option('--config <configFile>', 'Config file path')
    .option('--basePath <basePath>', 'Base directory for globs to resolve. Default to directory of config file if not provided')
    // Build specific options
    .option('--base <baseURL>', 'Base URL for deployment', { default: '/' })
    .option('--outDir <dir>', 'Output directory', { default: '.oxrc-inspector' })
    // Action
    .action(async (options) => {
        console.log(MARK_INFO, 'Building static oxlint oxfmt config inspector...')

        if (process.env.ESLINT_CONFIG)
            options.config ||= process.env.ESLINT_CONFIG

        const cwd = process.cwd()
        const outDir = resolve(cwd, options.outDir)

        let configs
        try {
            const option = await resolveConfigPath({ cwd })
            configs = await readConfig(option)
        }
        catch (error) {
            if (error instanceof ConfigInspectorError) {
                error.prettyPrint()
                process.exit(1)
            }
            throw error
        }

        let baseURL = options.base
        if (!baseURL.endsWith('/'))
            baseURL += '/'
        if (!baseURL.startsWith('/'))
            baseURL = `/${baseURL}`
        baseURL = baseURL.replace(/\/+/g, '/')

        if (existsSync(outDir))
            await fs.rm(outDir, { recursive: true })
        await fs.mkdir(outDir, { recursive: true })
        await fs.cp(distDir, outDir, { recursive: true })
        const htmlFiles = await glob('**/*.html', { cwd: distDir, onlyFiles: true, expandDirectories: false })
        // Rewrite HTML files with base URL
        if (baseURL !== '/') {
            for (const file of htmlFiles) {
                const content = await fs.readFile(resolve(distDir, file), 'utf-8')
                const newContent = content
                    .replaceAll(/\s(href|src)="\//g, ` $1="${baseURL}`)
                    .replaceAll('baseURL:"/"', `baseURL:"${baseURL}"`)
                await fs.writeFile(resolve(outDir, file), newContent, 'utf-8')
            }
        }
        await fs.mkdir(resolve(outDir, 'api'), { recursive: true })

        configs.meta.lintConfigPath = ''
        configs.meta.formatConfigPath = ''
        configs.meta.eslintConfigPath = ''
        configs.meta.basePath = ''
        await fs.writeFile(resolve(outDir, 'api/payload.json'), JSON.stringify(configs, null, 2), 'utf-8')

        console.log(MARK_CHECK, `Built to ${relative(cwd, outDir)}`)
        console.log(MARK_INFO, `You can use static server like \`npx serve ${relative(cwd, outDir)}\` to serve the inspector`)
    })

cli.command('', description)
    .option('--host <host>', 'Host', { default: process.env.HOST || '127.0.0.1' })
    .option('--port <port>', 'Port', { default: process.env.PORT || 7777 })
    .option('--open', 'Open browser', { default: true })
    .action(async (options) => {
        const host = options.host
        const port = await getPort({ port: options.port, portRange: [7777, 9000], host })

        intro(
            [
                chalk.blueBright(`✨ `),
                chalk.bgGreenBright.black('Oxc inspector'),
                chalk.blue(`@${version}`),
                chalk.blueBright(` ✨`),
            ].join(''),
        )

        log.step(`${MARK_CHECK} Starting OXC config inspector at ${c.green(`http://${host === '127.0.0.1' ? 'localhost' : host}:${port}`)}`)

        const cwd = process.cwd()
        const server = await createHostServer({ cwd })

        server.listen(port, host, async () => {
            if (options.open)
                await open(`http://${host === '127.0.0.1' ? 'localhost' : host}:${port}`)
        })
    })

cli.help()
cli.version(version)
cli.parse()
