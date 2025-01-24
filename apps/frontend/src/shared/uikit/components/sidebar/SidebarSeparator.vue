<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Separator } from 'src/shared/uikit/components/separator'
import { cn } from 'src/shared/uikit/lib/utils'

const props = defineProps<{
    class?: HTMLAttributes['class']
}>()
</script>

<template>
    <Separator data-sidebar="separator" :class="cn('mx-2 w-auto bg-sidebar-border', props.class)">
        <slot />
    </Separator>
</template>
