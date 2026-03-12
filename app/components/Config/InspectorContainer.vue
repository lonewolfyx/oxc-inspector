<template>
    <slot />
</template>

<script lang="ts" setup>
import { meta, oxfmt, oxlint } from '~~/oxc-inspector.meta.json' with { type: 'json' }
import { providerConfigInspector } from '~/components/Config/index'

defineOptions({
    name: 'ConfigInspectorContainer',
})

const loading = ref<boolean>(true)

setTimeout(() => {
    loading.value = false
}, 2000)

const oxLinter = computed(() => oxlint)
const oxFormat = computed<ILinterInspectorPayload['oxfmt'] | null>(() => oxfmt)
const metaOptions = computed<ILinterInspectorPayload['meta']>(() => meta)

providerConfigInspector({
    loading,
    oxLinter,
    oxFormat,
    metaOptions,
    oxRules: computed(() => oxlint.rules),
})
</script>
