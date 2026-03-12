<template>
    <div class="flex flex-col gap-4">
        <div class="flex justify-between items-center **:data-[slot=separator]:!h-4">
            <NuxtLink :to="app.github.link" class="flex items-center gap-2" target="_blank">
                <img :alt="app.shortTitle" class="inline-block size-12" src="/favicon.svg">
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
        <div class="flex items-center gap-1 text-sm font-medium capitalize">
            <span class="opacity-50">oxlint version:</span>
            <span class="font-bold">{{ metaOptions.version.oxlint }}</span>
            <template v-if="metaOptions.version.oxfmt">
                <span class="opacity-50">oxfmt version:</span>
                <span class="font-bold">{{ metaOptions.version.oxfmt }}</span>
            </template>
            <span class="opacity-50">,</span>
            <span class="opacity-50">Composed with</span>
            <span class="font-bold">{{ Object.keys(oxLinter.configs).length }}</span>
            <span class="opacity-50">config items</span>
        </div>
        <div class="flex justify-start items-center gap-4">
            <template
                v-for="menu in navMenus"
                :key="menu.name"
            >
                <Button
                    v-if="menu.status"
                    :class="cn(
                        'text-base capitalize',
                        'rounded shadow-none bg-transparent',
                        routeName === menu.name ? 'color-active' : 'hover:border-teal-600/25 hover:bg-teal-400/5',
                    )"
                    variant="outline"
                >
                    <NuxtLink :to="`/${menu.name}`" class="flex items-center gap-3">
                        <Icon
                            :name="menu.icon"
                            mode="svg"
                        />
                        {{ menu.label }}
                    </NuxtLink>
                </Button>
            </template>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useConfigInspector } from '~/components/Config'
import { cn } from '~/lib/utils'

defineOptions({
    name: 'NavBar',
})

const app = useAppConfig()
const route = useRoute()
const routeName = computed(() => route.name as NavBar)

const { metaOptions, oxFormat, oxLinter } = useConfigInspector()

const navMenus = [
    {
        name: 'projects',
        label: 'projects',
        icon: 'ph:diamonds-four-duotone',
        status: true,
    },
    {
        name: 'configs',
        label: 'configs',
        icon: 'ph:stack-duotone',
        status: true,
    },
    {
        name: 'rules',
        label: 'rules',
        icon: 'ph:list-dashes-duotone',
        status: true,
    },
    {
        name: 'oxfmt',
        label: 'oxfmt',
        icon: 'ph:paint-brush-broad-fill',
        status: oxFormat.value != null,
    },
    {
        name: 'migration-rules',
        label: 'migration rules',
        icon: 'pajamas:merge',
        status: true,
    },
    {
        name: 'migration-configs',
        label: 'migration configs',
        icon: 'ph:file-code-duotone',
        status: true,
    },
    {
        name: 'eslint',
        label: 'eslint configs',
        icon: 'ph:stack-minus-duotone',
        status: true,
    },
]
</script>
