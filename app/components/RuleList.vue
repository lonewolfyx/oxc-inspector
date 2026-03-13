<template>
    <RuleItems
        :rule="ruleInfo"
    />
</template>

<script lang="ts" setup>
// oxlint-disable typescript/no-explicit-any
import type { IRulesMeta } from '#shared/types/types'
import type { AllowWarnDeny } from 'oxlint'
import { useConfigInspector } from '~/components/Config'

defineOptions({
    name: 'RuleList',
})

const props = defineProps<{
    rule: Record<string, any>
}>()

const { oxRules } = useConfigInspector()

const ruleInfo = computed(() => {
    const rules = (t => t.length ? t : props.rule[0])(props.rule[0].split('/').slice(1))
    return {
        ...oxRules.value[rules],
        level: props.rule[1],
    } as IRulesMeta & { level: AllowWarnDeny }
})

// const ruleLevel = computed(() => Array.isArray(props.rule[1]) ? props.rule[1][0] : props.rule[1])
</script>
