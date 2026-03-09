<template>
    <div class="flex justify-between items-center p-4 **:data-[slot=separator]:!h-4">
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
    <slot />
</template>

<script lang="ts" setup>
import { cn } from '~/lib/utils'
</script>
