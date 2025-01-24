<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { Input } from 'src/shared/uikit/components/input'
import { cn } from 'src/shared/uikit/lib/utils'

const props = defineProps<{
    class?: HTMLAttributes['class']
}>()
</script>

<template>
    <Input data-sidebar="input" :class="cn(
        'h-8 w-full bg-white shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring dark:bg-slate-950',
        props.class,
    )">
    <slot />
    </Input>
</template>
