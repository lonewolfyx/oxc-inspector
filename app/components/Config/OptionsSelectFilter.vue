<template>
    <label
        v-for="(i, idx) of options"
        :key="i"
        :class="cn(
            'px-2.5 py-1 rounded-full text-xs font-medium transition-colors border cursor-pointer select-none',
            value !== i && 'border-border text-muted-foreground hover:border-foreground/50',
        )"
        v-bind="props?.[idx]"
    >
        <input
            v-model="value"
            :value="i"
            class="sr-only"
            name="status-filter"
            type="radio"
        >
        {{ titles[idx] }}
    </label>
</template>

<script lang="ts" setup>
import { cn } from '~/lib/utils'

defineOptions({
    name: 'ConfigOptionsSelectFilter',
})

defineProps<{
    titles: string[]
    options: string[]
    props?: any[]
}>()

const value = defineModel()
</script>
