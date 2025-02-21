<script setup lang="ts">
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<template>
    <div>
        <p class="font-semibold text-2xl">{{ route.name }}</p>
    </div>
</template>