<template>
    <div class="flex flex-col space-y-12">
        <div class="flex flex-col gap-4">
            <div class="text-xl capitalize font-mono font-extralight text-muted-foreground mb-4">
                Framework
            </div>
            <div class="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5">
                <div
                    v-for="(i, idx) in projects.env"
                    :key="idx"
                    :class="cn(
                        'relative flex flex-col justify-center items-center gap-4',
                        'bg-secondary dark:bg-slate-800/70 w-auto h-24 cursor-pointer',
                        'rounded-2xl transition-all',
                        'text-foreground',
                        {
                            'opacity-20': !i.exists,
                        },
                        'data-[exists=false]:hover:opacity-100 data-[exists=false]:hover:text-white',
                        'data-[exists=true]:hover:bg-teal-500/20',
                        'data-[exists=true]:hover:opacity-100',
                    )"
                    :data-exists="i.exists"
                >
                    <div
                        :class="cn(
                            'absolute -top-2.5 left-2',
                            'bg-teal-500/80 rounded px-2',
                            'text-sm font-medium',
                        )"
                    >
                        {{ i.version }}
                    </div>
                    <ConfigFrameworkIcon :framework="idx" />
                    <span class="text-xs font-mono capitalize font-extralight">{{ idx }}</span>
                </div>
            </div>
        </div>

        <div class="flex flex-col gap-4">
            <div class="text-xl capitalize font-mono font-extralight text-muted-foreground mb-4">
                Dependencies infomations
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div
                    :class="cn(
                        'flex flex-col',
                        'border rounded-lg',
                    )"
                >
                    <div class="flex border-b mb-2 p-4 text-xl font-medium capitalize ">
                        Dependencies
                    </div>
                    <div class="p-4 max-h-96 flex-1 overflow-auto">
                        <ConfigDependenciesList :dependencies="projects.package.dependencies" />
                    </div>
                </div>
                <div
                    :class="cn(
                        'flex flex-col',
                        'border rounded-lg',
                    )"
                >
                    <div class="flex border-b mb-2 p-4 text-xl font-medium capitalize ">
                        devDependencies
                    </div>
                    <div class="p-4 max-h-96 flex-1 overflow-auto">
                        <ConfigDependenciesList :dependencies="projects.package.devDependencies" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useConfigInspector } from '~/components/Config'
import { cn } from '~/lib/utils'

const { projects } = useConfigInspector()
</script>
