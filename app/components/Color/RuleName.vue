<template>
    <div
        :class="cn(
            'flex flex-col items-start gap-1',
            'font-mono overflow-hidden text-ellipsis whitespace-nowrap',
        )"
    >
        <div>
            <span v-if="parsed.scope" :style="{ color: getPluginColor(parsed.scope) }">{{ parsed.scope }}</span>
            <span v-if="parsed.scope" class="opacity-30">/</span>
        </div>
        <span class="opacity-75">{{ parsed.name }}</span>
    </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { cn } from '~/lib/utils'

defineOptions({
    name: 'ColorRuleName',
})

const props = defineProps<{
    name: string
    prefix?: string
    url?: string
    as?: string
    deprecated?: boolean | {
        message?: string
        url?: string
    }
    borderless?: boolean
    break?: boolean
}>()

const parsed = computed(() => {
    if (props.prefix) {
        if (props.name.startsWith(props.prefix)) {
            return {
                scope: props.prefix,
                name: props.name.slice(props.prefix.length).replace(/^\/+/, ''),
            }
        }
        else {
            return {
                scope: undefined,
                name: props.name,
            }
        }
    }
    const parts = props.name.split('/')
    if (parts.length === 1) {
        return {
            scope: undefined,
            name: parts[0],
        }
    }
    return {
        scope: parts[0],
        name: parts.slice(1).join('/'),
    }
})
</script>
