<template>
    <slot />
</template>

<script lang="ts" setup>
// oxlint-disable typescript/no-explicit-any

import type { IConfigInspectorMeta, IFormatConfigMeta, ILinterInspectorPayload } from '#shared/types/inspector'
import type { ErrorInfo, IOXLintConfig } from '#shared/types/types'
import { $fetch } from 'ofetch'
// import { meta, oxfmt, oxlint } from '~~/oxc-inspector.meta.json' with { type: 'json' }
import { providerConfigInspector } from '~/components/Config/index'

defineOptions({
    name: 'ConfigInspectorContainer',
})

const config = useRuntimeConfig()

const loading = ref<boolean>(true)

const data = ref<ILinterInspectorPayload>()

let _promise: Promise<ILinterInspectorPayload | undefined> | undefined

async function getData(baseURL: string) {
    const payload = await $fetch<ILinterInspectorPayload | ErrorInfo>(`/api/payload.json`, { baseURL })
    if ('error' in payload) {
        loading.value = false
        return ''
    }
    loading.value = false
    data.value = payload
    console.log('[OXC Config Inspector] Config payload', payload)
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
        return res
    })
}

init(config.app.baseURL)

const oxLinter = computed(() => payload.value?.oxlint) as ComputedRef<IOXLintConfig>
const oxFormat = computed(() => payload.value?.oxfmt) as ComputedRef<IFormatConfigMeta[] | null>
const metaOptions = computed(() => payload.value?.meta) as ComputedRef<IConfigInspectorMeta>

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

        if (useRulesKey.includes(rule)) {
            const options = useRules[rule]!.options
            const severity = useRules[rule]!.severity
            rulesMap.set(rule, {
                ...ruleMeta,
                severity,
                options,
            })
        }
        else {
            rulesMap.set(rule, {
                ...ruleMeta,
                severity: [],
                options: [],
            })
        }
    }

    return Object.fromEntries(rulesMap.entries()) as IResolveLinterConfigRules
})

providerConfigInspector({
    loading,
    oxLinter,
    oxFormat,
    metaOptions,
    oxRules,
    // oxRules: computed(() => oxlint.rules),
})
</script>
