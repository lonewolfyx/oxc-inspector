<template>
    <Icon
        :name="icon"
        :class="cn(
            'my-1 flex-none text-xl opacity-5',
            color,
        )"
        mode="svg"
    />
</template>

<script lang="ts" setup>
import { cn } from '~/lib/utils'

defineOptions({
    name: 'ConfigSeverityIcon',
})

const props = defineProps<{
    severity: SeverityValue
}>()

const icon = computed(() => ({
    error: 'ph:warning-circle-duotone',
    warn: 'ph:warning-duotone',
    off: 'ph:circle-half-tilt-duotone',
}[props.severity]))

const color = computed(() => ({
    error: 'text-red-500 opacity-80',
    warn: 'text-yellow-500 opacity-80 dark:text-yellow-400',
    off: 'text-gray-500 opacity-50',
}[props.severity]))
</script>
