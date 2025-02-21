<script setup lang="ts">
import { NButton } from 'naive-ui';
import { Add } from '@vicons/ionicons5';

type Emits = {
    toggleDialog: () => void;
};

defineEmits<Emits>();
</script>

<template>
    <n-button
        color="#222"
        text-color="#fff"
        class="flex items-center rounded-lg justify-center"
        @click="$emit('toggleDialog')"
    >
        <Add class="w-[18px]" />

        <div class="ml-[4px]">
            <p class="font-semibold">New event</p>
        </div>
    </n-button>
</template>
