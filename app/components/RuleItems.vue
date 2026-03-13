<template>
    <div class="relative p-4 py-3 border rounded max-w-full overflow-hidden space-y-2">
        <div class="absolute top-2 right-4">
            <template v-if="routePath === 'configs'">
                <ConfigSeverityIcon
                    :severity="getRuleSeverity(rule.level)"
                />
            </template>
            <template v-else>
                <div v-if="rule.severity?.length" class="flex flex-col items-start">
                    <div
                        v-for="severity in rule.severity"
                        :key="severity as string"
                    >
                        <ConfigSeverityIcon
                            :severity="getRuleSeverity(severity)"
                        />
                    </div>
                </div>
            </template>
        </div>
        <div>
            <Popover>
                <PopoverTrigger>
                    <ColorRuleName
                        :name="`${rule.source}/${rule.name}`"
                        :prefix="rule.source"
                    />
                </PopoverTrigger>
                <PopoverContent class="max-h-[50vh] w-auto max-w-2xl overflow-scroll">
                    <div class="flex flex-col gap-2">
                        <div class="flex items-center border-b pb-2 gap-2">
                            <Button as-child size="sm" variant="secondary">
                                <NuxtLink :to="rule.docs.url" target="_blank">
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
                            v-if="ruleOptions.length || defaultOptions.length"
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
                            <TabsContent v-if="ruleOptions.length" class="flex flex-col gap-2" value="state">
                                <Shiki
                                    v-for="(options, idx) of ruleOptions"
                                    :key="idx"
                                    :class="cn(
                                        'w-full max-w-full max-h-100',
                                        'overflow-scroll bg-zinc-100 dark:bg-slate-800/20 rounded-lg p-2 text-sm',
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
                                        'overflow-scroll bg-zinc-100 dark:bg-slate-800/20 rounded-lg p-2 text-sm',
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
                {{ rule.docs.description }}
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { IRulesMeta } from '#shared/types/types'
import type { AllowWarnDeny } from 'oxlint'
import { cn } from '~/lib/utils'
import { getRuleSeverity } from '~/utils/rules'

defineOptions({
    name: 'RuleItems',
})

const props = defineProps<{
    rule: IRulesMeta & { level: AllowWarnDeny }
}>()

const { copy } = useClipboard()

const defaultOptions = computed(() => props.rule.defaultOptions.length ? props.rule.defaultOptions : [])

const ruleOptions = computed(() => props.rule.options ?? [])

const routePath = computed(() => useRoute().name)
</script>
