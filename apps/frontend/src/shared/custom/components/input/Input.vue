<script setup lang="ts">
import { NInput } from 'naive-ui';

type Props = {
    value: string;
    size: 'large' | 'small';
    type: 'text' | 'textarea';
    placeholder?: string;
};

defineProps<Props>();

defineEmits<{
    (e: 'onChange', value: string): void;
}>();

</script>

<template>
    <n-input :value="value" :type="type" :placeholder="placeholder" :size="size" @input="$emit('onChange', $event)" />
</template>
