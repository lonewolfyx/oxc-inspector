<template>
    <TooltipProvider>
        <SiteBody>
            <ConfigInspectorContainer>
                <ConfigInspector />
            </ConfigInspectorContainer>
        </SiteBody>
    </TooltipProvider>
</template>

<script setup lang="ts">
useHead({
    htmlAttrs: {
        class: 'h-full',
    },
})
</script>
