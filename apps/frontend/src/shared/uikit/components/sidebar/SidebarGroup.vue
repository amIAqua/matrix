<script setup lang="ts">
import type { HTMLAttributes } from 'vue';
import { cn } from 'src/shared/uikit/lib/utils';

const props = defineProps<{
    class?: HTMLAttributes['class']
}>();
</script>

<template>
    <div data-sidebar="group" :class="cn('relative flex w-full min-w-0 flex-col', props.class)">
        <slot />
    </div>
</template>
