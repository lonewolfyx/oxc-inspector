<template>
    <Tooltip>
        <TooltipTrigger>
            <div
                :class="cn(
                    'flex gap-2 items-center',
                    count ? 'text-purple-500' : 'opacity-25',
                )"
            >
                <Icon
                    mode="svg"
                    name="ph:eye-closed-duotone"
                />
                <span class="text-sm min-w-6 font-mono font-medium">
                    {{ count }}
                </span>
                <!-- ignores -->
            </div>
        </TooltipTrigger>
        <TooltipContent>
            <p>{{ count || '0' }} Ignores</p>
        </TooltipContent>
    </Tooltip>
</template>

<script lang="ts" setup>
import { cn } from '~/lib/utils'

defineOptions({
    name: 'ConfigStateIgnores',
})

defineProps<{
    count: number | string
}>()
</script>
