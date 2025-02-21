<script setup lang="ts">
import { useEvents } from 'src/page/events/composables/events/useEvents';

const { events } = useEvents();
</script>

<template>
    {{ events }}
</template>
