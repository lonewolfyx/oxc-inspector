<template>
    <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-4">
            <div class="flex items-center">
                <InputGroup class="border-0">
                    <InputGroup class="[--radius:9999px]">
                        <InputGroupAddon>
                            <InputGroupButton size="icon-xs" variant="secondary">
                                <Icon mode="svg" name="ph:magnifying-glass-duotone" />
                            </InputGroupButton>
                        </InputGroupAddon>
                        <InputGroupInput v-model="filters.search" placeholder="Search Rules" />
                    </InputGroup>
                </InputGroup>
            </div>
            <div class="flex items-center gap-3">
                <span class="text-sm text-muted-foreground w-12 flex-none capitalize">plugins</span>
                <div class="flex flex-wrap gap-1.5">
                    <ConfigOptionsSelectFilter
                        v-model="filters.plugins"
                        :options="['', ...availablePlugins]"
                        :props="['', ...availablePlugins.map(p => ({
                            style: filters.plugins === p ? {
                                borderColor: getPluginColor(p),
                                color: getPluginColor(p),
                                backgroundColor: `${getPluginColor(p)}18`,
                            } : {},
                        }))]"
                        :titles="['All', ...availablePlugins]"
                    />
                </div>
            </div>
            <div class="flex items-center gap-3">
                <span class="text-sm text-muted-foreground w-12 flex-none capitalize">Usage</span>
                <div class="flex flex-wrap gap-1.5">
                    <ConfigOptionsSelectFilter
                        v-model="filters.states"
                        :options="['', 'Using', 'Unused', 'Error', 'Warn', 'Off']"
                        :props="['', ...['Using', 'Unused', 'Error', 'Warn', 'Off'].map(s => ({
                            style: filters.states === s ? {
                                borderColor: getPluginColor(s),
                                color: getPluginColor(s),
                                backgroundColor: `${getPluginColor(s)}18`,
                            } : {},
                        }))]"
                        :titles="['All', 'Using', 'Unused', 'Error', 'Warn', 'Off']"
                    />
                </div>
            </div>
        </div>

        <div class="flex">
            <Button
                v-if="filtered.length"
                variant="ghost"
                @click="presetFilter"
            >
                <Icon mode="svg" name="ph:x-circle-duotone" />
                Clear
            </Button>
        </div>

        <div v-if="filtered.length === 0" class="flex flex-col items-center gap-2 py-16 text-muted-foreground">
            <Icon class="text-4xl" mode="svg" name="ph:funnel-x-duotone" />
            <span class="text-sm">No rules match the current filters</span>
        </div>

        <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div
                v-for="rule in filtered"
                :key="rule.name"
            >
                <RuleItems :rule="rule" />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { IRulesMeta } from '#shared/types/types'
import Fuse from 'fuse.js'
import { useConfigInspector } from '~/components/Config'

const { oxRules } = useConfigInspector()

const filters = reactive({
    search: '',
    plugins: '',
    states: '',
})

function presetFilter() {
    filters.search = ''
    filters.plugins = ''
    filters.states = ''
}

const availablePlugins = computed(() => {
    const plugins = new Set<string>()
    const rules = Object.values(oxRules.value || {}) as IRulesMeta[]
    for (const rule of rules) {
        if (rule.plugin)
            plugins.add(rule.plugin)
    }
    return Array.from(plugins).sort()
})

const conditionalFiltered = computed(() => {
    let rules = Object.values(oxRules.value) as IRulesMeta[]

    if (filters.plugins) {
        rules = rules.filter(rule => rule.plugin === filters.plugins)
    }

    if (filters.states) {
        rules = rules.filter((rule) => {
            switch (filters.states) {
                case 'using':
                    return rule.isUsing
                case 'unused':
                    return rule.isUnused
                case 'error':
                    return rule.hasError
                case 'warn':
                    return rule.hasWarn
                case 'off':
                    return rule.hasOff
                case 'only-off':
                    return rule.isOnlyOff
                default:
                    return true
            }
        })
    }

    return rules
})

const fuse = computed(() => new Fuse(conditionalFiltered.value, {
    keys: [
        'name',
        'docs.description',
    ],
    threshold: 0.5,
}))

const filtered = ref(conditionalFiltered.value)

watchDebounced(() => [filters.search, conditionalFiltered.value], () => {
    if (!filters.search)
        return filtered.value = conditionalFiltered.value
    filtered.value = fuse.value.search(filters.search).map(i => i.item)
}, {
    debounce: 200,
})
</script>
