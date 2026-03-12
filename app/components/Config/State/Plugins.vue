<template>
    <Tooltip>
        <TooltipTrigger>
            <div
                :class="cn(
                    'flex gap-2 items-center',
                    count ? 'text-teal-500' : 'opacity-25',
                )"
            >
                <Icon
                    mode="svg"
                    name="ph:plug-duotone"
                />
                <span class="text-sm min-w-6 font-mono font-medium">
                    {{ count }}
                </span>
                <!-- plugins -->
            </div>
        </TooltipTrigger>
        <TooltipContent>
            <p>{{ count || '0' }} Plugins</p>
        </TooltipContent>
    </Tooltip>
</template>

<script lang="ts" setup>
import { cn } from '~/lib/utils'

defineOptions({
    name: 'ConfigStatePlugins',
})

defineProps<{
    count: number | string
}>()
</script>
