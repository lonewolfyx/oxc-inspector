<template>
    <Body class="antialiased flex h-full text-base text-foreground bg-zinc-100">
        <div class="absolute inset-0 z-0">
            <div class="relative h-full w-full bg-slate-50 dark:bg-slate-900">
                <div
                    :class="cn(
                        'absolute bottom-0 left-0 right-0 top-0',
                        'bg-[size:16px_16px]',
                        'bg-[radial-gradient(#0000001a_1px,theme(colors.slate.50)_1px)]',
                        'dark:bg-[radial-gradient(#ffffff33_1px,theme(colors.slate.900)_1px)]',
                    )"
                />
            </div>
        </div>
        <div class="flex grow flex-col z-10 px-4 lg:px-14 py-8 lg:py-10">
            <slot />
        </div>
    </Body>
</template>

<script lang="ts" setup>
import { cn } from '~/lib/utils'

defineOptions({
    name: 'SiteBody',
})
</script>
