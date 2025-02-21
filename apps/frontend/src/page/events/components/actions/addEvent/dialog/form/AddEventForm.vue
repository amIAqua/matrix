<script setup lang="ts">
import { NSpace, NInput } from 'naive-ui';
import { ref } from 'vue';

const form = ref({
    title: '',
    description: '',
});
</script>

<template>
    <n-space vertical>
        <n-input v-model:value="form.title" type="text" placeholder="Event title" size="large" />
        <n-input v-model:value="form.description" type="textarea" placeholder="Event description" />
    </n-space>
</template>