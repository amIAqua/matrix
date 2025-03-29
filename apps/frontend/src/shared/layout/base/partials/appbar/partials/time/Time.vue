<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

const MINUTE = 1000 * 60;
const timeLocale = 'sk-SK';
const timeFormat: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit'
};

const time = ref(
    new Date().toLocaleTimeString(timeLocale, timeFormat),
);

let interval: number;
onMounted(() => {
    interval = setInterval(() => {
        time.value = new Date().toLocaleTimeString(
            timeLocale,
            timeFormat,
        );
    }, MINUTE);
});

onUnmounted(() => {
    clearInterval(interval);
});
</script>

<template>
    <div>
        <p :class="$style.time">{{ time }}</p>
    </div>
</template>

<style lang="css" module>
.time {
    color: var(--brand-white);
}
</style>