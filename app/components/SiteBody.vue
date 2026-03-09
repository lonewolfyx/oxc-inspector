<template>
    <Body class="antialiased flex h-full text-base text-foreground bg-zinc-100">
        <div class="absolute inset-0 z-0">
            <div class="relative h-full w-full bg-[#f8fafc]">
                <div
                    class="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(#0000001a_1px,#f8fafc_1px)] bg-[size:16px_16px] "
                />
            </div>
        </div>
        <div class="flex grow flex-col z-10">
            <slot />
        </div>
    </Body>
</template>

<script lang="ts" setup>
defineOptions({
    name: 'SiteBody',
})
</script>
