import type { ILinterInspectorPayload } from '#shared/types/inspector'
import type { IResolveConfig } from '#shared/types/types'
import type { WebSocket } from 'ws'
import chokidar from 'chokidar'
import { getPort } from 'get-port-please'
import { WebSocketServer } from 'ws'
import { resolveConfigPath } from '~~/src/config'
import { readConfig } from '~~/src/configs'
import { lintConfigFilenames, MARK_CHECK } from '~~/src/constants'

const readErrorWarning = `Failed to load \`${lintConfigFilenames.join('`, `')}\`.`

export async function createWebSocketServer(options: IResolveConfig) {
    let payload: ILinterInspectorPayload | undefined
    const port = await getPort({ port: 7811, random: true })
    const wss = new WebSocketServer({
        port,
    })

    const wsClients = new Set<WebSocket>()

    wss.on('connection', (ws) => {
        wsClients.add(ws)
        console.log(MARK_CHECK, 'Websocket client connected')
        ws.on('close', () => wsClients.delete(ws))
    })

    const resolvedConfigPath = await resolveConfigPath(options)

    const { basePath } = resolvedConfigPath

    const watcher = chokidar.watch([], {
        ignoreInitial: true,
        cwd: basePath,
    })

    watcher.on('change', (path) => {
        payload = undefined
        console.log()
        console.log(MARK_CHECK, 'Config change detected', path)
        wsClients.forEach((ws) => {
            ws.send(JSON.stringify({
                type: 'config-change',
                path,
            }))
        })
    })

    const getPayloadData = async () => {
        try {
            if (!payload) {
                return readConfig(resolvedConfigPath).then((res) => {
                    const _payload = payload = res
                    _payload.meta.wsPort = port
                    return _payload
                })
            }

            return payload
        }
        catch {
            return {
                message: readErrorWarning,
                error: true,
            }
        }
    }

    return {
        port,
        wss,
        getPayloadData,
    }
}
