import type { IResolveConfig } from '#shared/types/types'
import { readFile, stat } from 'node:fs/promises'
import { createServer } from 'node:http'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createApp, eventHandler, serveStatic, toNodeListener } from 'h3'
import { lookup } from 'mrmime'
import { createWebSocketServer } from '~~/src/ws'

export const distDir = fileURLToPath(new URL('../dist/public', import.meta.url))

export async function createHostServer(options: IResolveConfig) {
    const app = createApp()

    const ws = await createWebSocketServer(options)

    const fileMap = new Map<string, Promise<string | undefined>>()
    const readCachedFile = (id: string) => {
        if (!fileMap.has(id)) {
            fileMap.set(
                id,
                readFile(id, 'utf-8').catch(() => undefined),
            )
        }
        return fileMap.get(id)
    }

    app.use(
        '/api/payload.json',
        eventHandler(async (event) => {
            event.node.res.setHeader('Content-Type', 'application/json')
            return await ws.getPayloadData()
        }),
    )

    app.use(
        '/',
        eventHandler(async (event) => {
            const result = await serveStatic(event, {
                fallthrough: true,
                getContents: (id: string) => readCachedFile(join(distDir, id)),
                getMeta: async (id: string) => {
                    const stats = await stat(join(distDir, id)).catch(() => {})
                    if (!stats || !stats.isFile())
                        return
                    return {
                        type: lookup(id),
                        size: stats.size,
                        mtime: stats.mtimeMs,
                    }
                },
            })

            if (!result)
                return readCachedFile(join(distDir, 'index.html'))
        }),
    )

    return createServer(toNodeListener(app))
}
