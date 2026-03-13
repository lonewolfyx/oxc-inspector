<template>
    <div>
        <NuxtLink
            :class="cn(
                'flex items-center gap-2 mr-1',
                'capitalize',
                'font-mono font-extralight font-stretch-condensed',
            )"
            target="_blank"
            :to="`https://github.com/${app.github.repo}`"
        >
            <img alt="" class="size-8 inline-block" src="/favicon.svg"> {{ app.title }}
        </NuxtLink>
    </div>
</template>

<script lang="ts" setup>
import { cn } from '~/lib/utils'

defineOptions({
    name: 'ConfigInspectorBadge',
})

const app = useAppConfig()
</script>
