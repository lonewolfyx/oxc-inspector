<template>
    <div class="flex flex-col space-y-6">
        <ConfigCard
            v-for="(linter, index) in oxLinter.configs as IResolveConfigMeta[]"
            :key="linter.name"
            :index="index + 1"
            :title="linter.name"
        >
            <template #state>
                <ConfigStateFiles
                    :count="linter?.files ? linter?.files.length : ''"
                />
                <ConfigStateIgnores
                    :count="linter?.ignores ? linter?.ignores.length : ''"
                />
                <ConfigStatePlugins
                    :count="linter?.plugins ? linter?.plugins.length : ''"
                />
                <ConfigStateRules
                    :count="linter?.rules ? Object.keys(linter.rules).length : ''"
                />
            </template>

            <div v-if="linter.files" class="flex gap-2 items-start">
                <Icon
                    class="my-1 flex-none text-lg"
                    mode="svg"
                    name="ph:file-magnifying-glass-duotone"
                />
                <div class="flex flex-col gap-3">
                    <span class="font-mono font-medium">Applies to files matching</span>
                    <div class="flex gap-2 items-center flex-wrap">
                        <Badge
                            v-for="file in linter.files"
                            :key="file"
                            variant="secondary"
                        >
                            <ColorConfigName :name="file" />
                        </badge>
                    </div>
                </div>
            </div>

            <div v-if="linter.ignores" class="flex gap-2 items-start">
                <Icon
                    class="my-1 flex-none text-xl"
                    mode="svg"
                    name="ph:eye-closed-duotone"
                />
                <div class="flex flex-col gap-3">
                    <span class="font-mono font-medium">Ignore files globally</span>
                    <div class="flex gap-2 items-center flex-wrap">
                        <Badge
                            v-for="ignor in linter.ignores"
                            :key="ignor"
                            variant="secondary"
                        >
                            <ColorConfigName :name="ignor" />
                        </badge>
                    </div>
                </div>
            </div>

            <div v-if="linter.plugins?.length" class="flex gap-2 items-start">
                <Icon
                    class="my-1 flex-none text-xl"
                    mode="svg"
                    name="ph:plug-duotone"
                />
                <div class="flex flex-col gap-3">
                    <span class="font-mono font-medium">Plugins</span>
                    <div class="flex gap-2 items-center flex-wrap">
                        <Badge
                            v-for="plugin in linter.plugins as LintPluginOptionsSchema[] | ExternalPluginEntry[]"
                            :key="isObject(plugin) ? plugin.specifier : plugin"
                            variant="secondary"
                        >
                            <ColorConfigName :name="isObject(plugin) ? plugin.specifier : plugin" />
                        </badge>
                    </div>
                </div>
            </div>

            <div v-if="linter.rules" class="flex gap-2 items-start">
                <Icon
                    class="my-1 flex-none text-xl"
                    mode="svg"
                    name="ph:list-dashes-duotone"
                />
                <div class="flex-1">
                    <div class="flex flex-col gap-3">
                        <span class="font-mono font-medium">Rules</span>
                        <div class="grid grid-cols-1 lg:grid-cols-4 gap-4">
                            <RuleList
                                v-for="rule in Object.entries(linter.rules)"
                                :key="rule[0]"
                                :rule="rule"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </ConfigCard>
    </div>
</template>

<script lang="ts" setup>
import type { LintPluginOptionsSchema } from '#shared/types/types'
import type { ExternalPluginEntry } from 'oxlint'
import { isObject } from '@vueuse/core'
import { useConfigInspector } from '~/components/Config'

const { oxLinter } = useConfigInspector()
</script>
