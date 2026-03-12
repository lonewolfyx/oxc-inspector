<template>
    <div class="relative p-4 py-3 border rounded max-w-full overflow-hidden space-y-2">
        <div>
            <Popover>
                <PopoverTrigger>
                    <ColorRuleName
                        :name="`${ruleInfo.source}/${ruleInfo.name}`"
                        :prefix="ruleInfo.source"
                    />
                </PopoverTrigger>
                <PopoverContent class="max-h-[50vh] w-2xl overflow-scroll">
                    <div class="flex flex-col gap-2">
                        <div class="flex items-center border-b pb-2 gap-2">
                            <Button as-child size="sm" variant="secondary">
                                <NuxtLink :to="ruleInfo.docs.url" target="_blank">
                                    <Icon mode="svg" name="ph:book-duotone" />
                                    Docs
                                </NuxtLink>
                            </Button>
                            <Button size="sm" variant="secondary" @click="copy(rule.name)">
                                <Icon mode="svg" name="ph:copy-duotone" />
                                Copy name
                            </Button>
                        </div>
                        <Tabs
                            v-if="(ruleOptions || defaultOptions).length"
                            :default-value="ruleOptions.length ? 'state' : (defaultOptions.length ? 'default' : '')"
                        >
                            <TabsList class="h-auto px-2 py-1 mb-3">
                                <TabsTrigger v-if="ruleOptions.length" class="py-1.5" value="state">
                                    <Icon mode="svg" name="ph:sliders-duotone" />
                                    Rule options
                                </TabsTrigger>
                                <TabsTrigger v-if="defaultOptions.length" class="py-1.5" value="default">
                                    <Icon mode="svg" name="ph:faders-duotone" />
                                    Option defaults
                                </TabsTrigger>
                            </TabsList>
                            <TabsContent v-if="ruleOptions.length" value="state">
                                <Shiki
                                    v-for="(options, idx) of ruleOptions"
                                    :key="idx"
                                    :class="cn(
                                        'w-full max-w-full max-h-100',
                                        'overflow-scroll bg-zinc-100 rounded-lg p-2 text-sm',
                                    )"
                                    :code="stringifyOptions(options)"
                                    lang="ts"
                                />
                            </TabsContent>
                            <TabsContent v-if="defaultOptions.length" class="flex flex-col gap-2" value="default">
                                <Shiki
                                    v-for="(options, idx) of defaultOptions"
                                    :key="idx"
                                    :class="cn(
                                        'w-full max-w-full max-h-100',
                                        'overflow-scroll bg-zinc-100 rounded-lg p-2 text-sm',
                                    )"
                                    :code="stringifyOptions(options)"
                                    lang="ts"
                                />
                            </TabsContent>
                        </Tabs>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
        <div class="flex items-center gap-2 overflow-hidden">
            <div class="text-xs opacity-50 tracking-wide line-clamp-2">
                {{ ruleInfo.docs.description }}
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
// oxlint-disable typescript/no-explicit-any
import type { IRulesMeta } from '#shared/types/types'
import { useConfigInspector } from '~/components/Config'
import { cn } from '~/lib/utils'

defineOptions({
    name: 'RuleList',
})

const props = defineProps<{
    rule: Record<string, any>
}>()

const { copy } = useClipboard()

const { oxRules } = useConfigInspector()

const ruleInfo = computed(() => {
    const rules = (t => t.length ? t : props.rule[0])(props.rule[0].split('/').slice(1))
    return {
        ...oxRules.value[rules],
        level: props.rule[1],
    } as IRulesMeta & { level: string }
})

// const ruleLevel = computed(() => Array.isArray(props.rule[1]) ? props.rule[1][0] : props.rule[1])

const defaultOptions = computed(() => ruleInfo.value.defaultOptions.length ? ruleInfo.value.defaultOptions : [])

const ruleOptions = computed(() => {
    return Array.isArray(props.rule[1]) ? props.rule[1][1] : []
})
</script>
