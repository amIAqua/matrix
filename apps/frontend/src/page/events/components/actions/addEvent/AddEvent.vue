<script setup lang="ts">
import { ref } from 'vue';
import AddEventButton from 'src/page/events/components/actions/addEvent/button/AddEventButton.vue';
import AddEventDialog from 'src/page/events/components/actions/addEvent/dialog/AddEventDialog.vue';

const isAddEventModalVisible = ref(false);

const toggleDialog = (): void => {
    isAddEventModalVisible.value = !isAddEventModalVisible.value;
};
</script>

<template>
    <AddEventButton @toggle-dialog="toggleDialog" />

    <AddEventDialog
        :is-visible="isAddEventModalVisible"
        @toggle-dialog="toggleDialog"
    />
</template>
