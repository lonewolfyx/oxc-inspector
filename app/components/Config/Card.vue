<template>
    <Collapsible
        v-model:open="isOpen"
        :class="cn(
            'relative flex flex-col border rounded-xl',
            'font-mono',
        )"
    >
        <ConfigStateLine :index="index" />
        <CollapsibleTrigger
            :class="cn(
                'flex justify-between items-start w-full cursor-pointer',
                'bg-teal-500/5 dark:bg-slate-800/50 p-2',
                isOpen ? 'rounded-t-xl' : 'rounded-xl',
            )"
        >
            <span class="text-sm">
                <ColorConfigName :name="title" />
            </span>
            <div class="flex gap-4 items-center">
                <slot name="state" />
            </div>
        </CollapsibleTrigger>
        <CollapsibleContent
            :class="cn(
                'flex flex-col gap-4',
                'px-4 py-3',
                'bg-zinc-50/50 dark:bg-slate-800/20 rounded-b-xl',
            )"
        >
            <slot />
        </CollapsibleContent>
    </Collapsible>
</template>

<script lang="ts" setup>
import { cn } from '~/lib/utils'

defineOptions({
    name: 'ConfigCard',
})

defineProps<{
    index: number
    title: string
}>()

const isOpen = ref<boolean>(false)
</script>
