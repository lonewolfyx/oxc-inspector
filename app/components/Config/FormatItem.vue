<template>
    <ConfigCard :index="index + 1" :title="format.name">
        <template #state>
            <ConfigStateFiles
                :count="format.files ? (Array.isArray(format.files) ? format.files.length : 1) : ''"
            />
            <ConfigStateOptions
                :count="Object.values(format?.options ?? {}).length"
            />
        </template>
        <div v-if="format.files && Object.values(format.files).length" class="flex gap-2 items-start">
            <Icon class="my-1 flex-none" mode="svg" name="ph:eye-closed-duotone" />
            <div class="flex flex-col gap-3">
                <span class="text-sm font-mono font-medium">Ignore files globally</span>
                <div class="flex gap-2 items-center flex-wrap">
                    <Badge
                        v-for="files in format.files"
                        :key="files"
                        variant="secondary"
                    >
                        <ColorConfigName :name="files" />
                    </badge>
                </div>
            </div>
        </div>

        <!--            <div class="flex gap-2 items-start"> -->
        <!--                <Icon class="my-1 flex-none" mode="svg" name="ph:file-magnifying-glass-duotone" /> -->
        <!--                <div class="flex flex-col gap-3"> -->
        <!--                    <span class="text-sm font-mono font-medium">Applies to files matching</span> -->
        <!--                    <div class="flex gap-2 items-center flex-wrap"> -->
        <!--                        <Badge variant="secondary"> -->
        <!--                            sss -->
        <!--                        </badge> -->
        <!--                        <Badge variant="secondary"> -->
        <!--                            sss -->
        <!--                        </badge> -->
        <!--                        <Badge variant="secondary"> -->
        <!--                            sss -->
        <!--                        </badge> -->
        <!--                    </div> -->
        <!--                </div> -->
        <!--            </div> -->

        <div class="flex gap-2 items-start">
            <Icon class="my-1 flex-none" mode="svg" name="ph:sliders-duotone" />
            <div class="flex flex-col gap-3 w-full">
                <span class="text-sm font-mono font-medium">Options</span>
                <div class="flex flex-col border rounded-lg w-full">
                    <div class="overflow-auto p-2 px-3 bg-zinc-50 rounded-t-lg">
                        formatOptions
                    </div>
                    <Shiki
                        :class="cn(
                            'w-full max-w-full max-h-100',
                            'overflow-scroll bg-zinc-100 rounded-b-lg p-2 text-sm',
                        )"
                        :code="stringifyUnquoted(format.options)"
                        lang="ts"
                    />
                </div>
            </div>
        </div>
    </ConfigCard>
</template>

<script lang="ts" setup>
import { stringifyUnquoted } from '~/composables/strings'
import { cn } from '~/lib/utils'

defineOptions({
    name: 'ConfigFormatItem',
})

defineProps<{
    format: IFormatConfigMeta
    index: number
}>()
</script>
