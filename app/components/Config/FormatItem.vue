<template>
    <Collapsible
        v-model:open="isOpen"
        :class="cn(
            'relative flex flex-col border rounded-xl',
            'font-mono cursor-pointer',
        )"
    >
        <div class="absolute right-[calc(100%+10px)] top-1.5 font-mono opacity-35 max-lg:hidden">
            #{{ index + 1 }}
        </div>
        <CollapsibleTrigger
            :class="cn(
                'flex justify-between items-start w-full',
                'bg-teal-500/5 p-2',
                isOpen ? 'rounded-t-xl' : 'rounded-xl',
            )"
        >
            <span class="text-sm">
                <ColorConfigName :name="format.name" />
            </span>
            <div class="flex gap-4 items-center">
                <div
                    :class="cn(
                        'flex gap-2 items-center',
                        format?.files ? 'text-orange-500' : 'opacity-25',
                    )"
                >
                    <Icon
                        mode="svg"
                        name="ph:file-magnifying-glass-duotone"
                    />
                    <span class="text-sm min-w-6 font-mono font-medium">
                        {{ format.files ? (Array.isArray(format.files) ? format.files.length : 1) : '' }}
                    </span>
                    <!-- files -->
                </div>
                <!--                <div class="flex gap-2 items-center opacity-25"> -->
                <!--                    <Icon mode="svg" name="ph:eye-closed-duotone" /> -->
                <!--                    <span class="text-sm min-w-6 font-mono font-medium">24</span> -->
                <!--                    &lt;!&ndash; ignorePatterns &ndash;&gt; -->
                <!--                </div> -->
                <div
                    :class="cn(
                        Object.values(format?.options ?? {}).length ? 'text-green-500' : 'opacity-25',
                    )"
                    class="flex gap-2 items-center"
                >
                    <Icon
                        mode="svg"
                        name="ph:sliders-duotone"
                    />
                    <span class="text-sm min-w-6 font-mono font-medium">
                        {{ Object.values(format?.options ?? {}).length }}
                    </span>
                    <!-- options -->
                </div>
            </div>
        </CollapsibleTrigger>

        <CollapsibleContent
            class="flex flex-col gap-4 px-4 py-3 bg-zinc-50/50 rounded-b-xl"
        >
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
        </CollapsibleContent>
    </Collapsible>
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

const isOpen = ref<boolean>(false)
</script>
