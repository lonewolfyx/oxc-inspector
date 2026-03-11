<template>
    <div class="flex flex-col space-y-6">
        <template v-if="oxFormat">
            <ConfigFormatItem
                v-for="(item, index) in oxFormat"
                :key="item.name"
                :format="item"
                :index="index"
            />
        </template>
    </div>
</template>

<script lang="ts" setup>
import { useConfigInspector } from '~/components/Config'

const { oxFormat } = useConfigInspector()
</script>
