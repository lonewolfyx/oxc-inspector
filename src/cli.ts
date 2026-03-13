import process from 'node:process'
import { intro, log } from '@clack/prompts'
import c from 'ansis'
import cac from 'cac'
import chalk from 'chalk'
import { getPort } from 'get-port-please'
import open from 'open'
import { MARK_CHECK } from '~~/src/constants'
import { createHostServer } from '~~/src/server'
import { description, version } from '../package.json' with { type: 'json' }

const cli = cac('Oxc inspector')

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
