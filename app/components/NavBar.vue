<template>
    <div class="flex flex-col gap-4">
        <div class="flex justify-between items-center **:data-[slot=separator]:!h-4">
            <span
                :class="cn(
                    'text-2xl',
                    'font-mono font-extralight font-stretch-condensed',
                )"
            >
                Oxidation Compiler Config Inspector
            </span>
            <div class="flex items-center gap-3">
                <GitHubLink />
                <Separator orientation="vertical" />
                <ModeSwitcher />
            </div>
        </div>
        <div class="flex justify-start items-center gap-4">
            <Button class="text-base capitalize rounded bg-slate-50 dark:bg-slate-900 shadow-none" variant="outline">
                <Icon mode="svg" name="ph:diamonds-four-duotone" />
                Project
            </Button>
            <Button class="text-base capitalize rounded bg-slate-50 dark:bg-slate-900 shadow-none" variant="outline">
                <Icon mode="svg" name="ph:stack-duotone" />
                Configs
            </Button>
            <Button class="text-base capitalize rounded bg-slate-50 dark:bg-slate-900 shadow-none" variant="outline">
                <Icon mode="svg" name="ph:list-dashes-duotone" />
                rules
            </Button>
            <Button class="text-base capitalize rounded bg-slate-50 dark:bg-slate-900 shadow-none" variant="outline">
                <Icon mode="svg" name="ph:paint-brush-broad-fill" />
                oxfmt
            </Button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { cn } from '~/lib/utils'

defineOptions({
    name: 'NavBar',
})
</script>
