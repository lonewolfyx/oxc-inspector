<template>
    <slot />
</template>

<script lang="ts" setup>
// oxlint-disable typescript/no-explicit-any

import type { IConfigInspectorMeta, IFormatConfigMeta, ILinterInspectorPayload } from '#shared/types/inspector'
import type { ErrorInfo, IOXLintConfig, IResolveProjectConfig } from '#shared/types/types'
import { $fetch } from 'ofetch'
// import { meta, oxfmt, oxlint } from '~~/oxc-inspector.meta.json' with { type: 'json' }
import { providerConfigInspector } from '~/components/Config/index'

defineOptions({
    name: 'ConfigInspectorContainer',
})

const config = useRuntimeConfig()

const loading = ref<boolean>(true)

const data = ref<ILinterInspectorPayload>()
const errorInfo = ref<ErrorInfo>()

const LOG_NAME = '[OXC Config Inspector]'

let _promise: Promise<ILinterInspectorPayload | undefined> | undefined

async function getData(baseURL: string) {
    const payload = await $fetch<ILinterInspectorPayload | ErrorInfo>(`/api/payload.json`, { baseURL }).catch(() => {
        return {
            error: 'Error',
            message: 'Inspector data loading error, Please carefully review the error message displayed on the terminal.',
        }
    })
    if ('error' in payload) {
        loading.value = false
        errorInfo.value = payload
        return ''
    }
    loading.value = false
    data.value = payload
    console.log(`${LOG_NAME} Config payload`, payload)
    return payload
}

const payload = computed(() => data.value)

async function init(baseURL: string) {
    if (_promise) {
        return
    }

    _promise = getData(baseURL).then((res) => {
        if (!res)
            return

        if (typeof res.meta.wsPort === 'number') {
            // Connect to WebSocket, listen for config changes
            const ws = new WebSocket(`ws://${location.hostname}:${res.meta.wsPort}`)
            ws.addEventListener('message', async (event) => {
                console.log(LOG_NAME, 'WebSocket message', event.data)
                const payload = JSON.parse(event.data)
                if (payload.type === 'config-change')
                    await getData(baseURL)
            })
            ws.addEventListener('open', () => {
                console.log(LOG_NAME, 'WebSocket connected')
            })
            ws.addEventListener('close', () => {
                console.log(LOG_NAME, 'WebSocket closed')
            })
            ws.addEventListener('error', (error) => {
                console.error(LOG_NAME, 'WebSocket error', error)
            })
        }

        return res
    })
}

init(config.app.baseURL)

const oxLinter = computed(() => payload.value?.oxlint) as ComputedRef<IOXLintConfig>
const oxFormat = computed(() => payload.value?.oxfmt) as ComputedRef<IFormatConfigMeta[] | null>
const metaOptions = computed(() => payload.value?.meta) as ComputedRef<IConfigInspectorMeta>
const projects = computed(() => payload.value?.projects) as ComputedRef<IResolveProjectConfig>

const oxRules = computed(() => {
    const useRules = oxLinter.value.configs
        .filter(config => config.rules)
        .reduce((acc, config) => {
            Object.entries(config.rules!).forEach(([rawName, ruleConfig]) => {
                const ruleName = rawName.includes('/')
                    ? rawName.split('/').slice(1).join('/')
                    : rawName

                if (!acc[ruleName]) {
                    acc[ruleName] = {
                        severity: [],
                        options: [],
                    }
                }

                if (Array.isArray(ruleConfig)) {
                    acc[ruleName]!.options.push(ruleConfig[1])
                    acc[ruleName]!.severity.push(ruleConfig[0])
                }
                else {
                    acc[ruleName]!.severity.push(ruleConfig)
                }
            })

            return acc
        }, {} as Record<string, { severity: any[], options: any[] }>)

    const useRulesKey = Object.keys(useRules).filter(item => (t => t.length ? t : item)(item.split('/').slice(1)))

    const rulesMap = new Map<string, any>()
    for (const [rule, ruleMeta] of Object.entries(payload.value?.oxlint.rules || {})) {
        if (!rulesMap.has(rule)) {
            rulesMap.set(rule, {})
        }

        const plugin = ruleMeta.source

        if (useRulesKey.includes(rule)) {
            const options = useRules[rule]!.options
            const severity = useRules[rule]!.severity

            // Calculate status based on severity array
            const hasNonOff = severity.some((s: any) => s !== 'off' && s !== 'allow' && s !== 0)
            const allOff = severity.length > 0 && severity.every((s: any) => s === 'off' || s === 'allow' || s === 0)
            const hasError = severity.some((s: any) => s === 'error' || s === 'deny' || s === 2)
            const hasWarn = severity.some((s: any) => s === 'warn' || s === 1)
            const hasOff = severity.some((s: any) => s === 'off' || s === 'allow' || s === 0)

            rulesMap.set(rule, {
                ...ruleMeta,
                plugin,
                severity,
                options,
                isUsing: hasNonOff,
                isUnused: false,
                isOnlyOff: allOff,
                hasError,
                hasWarn,
                hasOff,
            })
        }
        else {
            rulesMap.set(rule, {
                ...ruleMeta,
                plugin,
                severity: [],
                options: [],
                isUsing: false,
                isUnused: true,
                isOnlyOff: false,
                hasError: false,
                hasWarn: false,
                hasOff: false,
            })
        }
    }

    return Object.fromEntries(rulesMap.entries()) as IResolveLinterConfigRules
})

providerConfigInspector({
    projects,
    errorInfo,
    loading,
    oxLinter,
    oxFormat,
    metaOptions,
    oxRules,
    // oxRules: computed(() => oxlint.rules),
})
</script>
