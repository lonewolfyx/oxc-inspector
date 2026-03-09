<template>
    <div class="flex flex-col gap-4">
        <div class="flex justify-between items-center **:data-[slot=separator]:!h-4">
            <NuxtLink class="flex items-center gap-2" :to="app.github.link">
                <img src="/favicon.svg" class="inline-block size-12" :alt="app.shortTitle">
                <span
                    :class="cn(
                        'text-2xl capitalize',
                        'font-mono font-extralight font-stretch-condensed',
                    )"
                >
                    {{ app.title }}
                </span>
            </NuxtLink>
            <div class="flex items-center gap-3">
                <GitHubLink />
                <Separator orientation="vertical" />
                <ModeSwitcher />
            </div>
        </div>
        <div class="flex justify-start items-center gap-4">
            <Button
                v-for="menu in navMenus"
                :key="menu.name"
                :class="cn(
                    'text-base capitalize',
                    'rounded shadow-none',
                    routeName === menu.name ? 'color-active' : 'hover:border-teal-600/25 hover:bg-teal-400/5',
                )"
                variant="outline"
            >
                <NuxtLink :to="`/${menu.name}`" class="flex items-center gap-3">
                    <Icon
                        :name="menu.icon"
                        mode="svg"
                    />
                    {{ menu.name }}
                </NuxtLink>
            </Button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { NavBar } from '#shared/types'
import { cn } from '~/lib/utils'

defineOptions({
    name: 'NavBar',
})

const app = useAppConfig()
const route = useRoute()
const routeName = computed(() => route.name as NavBar)

const navMenus = [
    {
        name: 'projects',
        icon: 'ph:diamonds-four-duotone',
    },
    {
        name: 'configs',
        icon: 'ph:stack-duotone',
    },
    {
        name: 'rules',
        icon: 'ph:list-dashes-duotone',
    },
    {
        name: 'oxfmt',
        icon: 'ph:paint-brush-broad-fill',
    },
]
</script>
