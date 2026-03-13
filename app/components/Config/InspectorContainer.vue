<template>
    <slot />
</template>

<script lang="ts" setup>
// oxlint-disable typescript/no-explicit-any
import type { IOXLintConfig } from '#shared/types/types'
import { meta, oxfmt, oxlint } from '~~/oxc-inspector.meta.json' with { type: 'json' }
import { providerConfigInspector } from '~/components/Config/index'

defineOptions({
    name: 'ConfigInspectorContainer',
})

const loading = ref<boolean>(true)

setTimeout(() => {
    loading.value = false
}, 2000)

const oxLinter = computed(() => oxlint) as unknown as ComputedRef<IOXLintConfig>
const oxFormat = computed<ILinterInspectorPayload['oxfmt'] | null>(() => oxfmt)
const metaOptions = computed<ILinterInspectorPayload['meta']>(() => meta)

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
    for (const [rule, ruleMeta] of Object.entries(oxlint.rules)) {
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
