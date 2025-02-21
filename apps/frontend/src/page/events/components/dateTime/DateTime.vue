<script setup lang="ts">
import { computed, onUnmounted, ref } from 'vue';

const currentDateAndTime = ref(new Date());
const MINUTE = 60000;

const interval = setInterval(() => {
    currentDateAndTime.value = new Date();
}, MINUTE);

const dateFormatted = computed(() =>
    new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    }).format(currentDateAndTime.value)
);

const timeFormatted = computed(() =>
    new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
    }).format(currentDateAndTime.value)
);

onUnmounted(() => {
    clearInterval(interval);
});
</script>

<template>
    <div class="flex flex-col items-start">
        <p className="text-xl font-semibold">{{ dateFormatted }}</p>
        <p className="text-sm">{{ timeFormatted }}</p>
    </div>
</template>