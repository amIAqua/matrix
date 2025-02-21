<script setup lang="ts">
import { NModal, NButton } from 'naive-ui';
import { CloseOutline } from '@vicons/ionicons5';
import AddEventForm from 'src/page/events/components/actions/addEvent/dialog/form/AddEventForm.vue';

type Props = {
    isVisible: boolean;
};
defineProps<Props>();

type Emits = {
    toggleDialog: () => void;
};
defineEmits<Emits>();
</script>

<template>
    <n-modal :show="isVisible" title="New event">
        <div
            class="min-w-[300px] bg-white p-[20px] rounded-[20px] relative flex flex-col border-solid border-[2px] border-stone-200"
        >
            <div
                @click="$emit('toggleDialog')"
                class="absolute top-[20px] right-[20px]"
            >
                <CloseOutline class="w-[30px] h-[30px] cursor-pointer" />
            </div>

            <div class="mb-[20px]">
                <p class="font-semibold text-[20px]">New event</p>
            </div>

            <div class="mb-[20px]">
                <AddEventForm />
            </div>

            <div class="flex w-full justify-end">
                <n-button
                    color="#222"
                    text-color="#fff"
                    class="rounded-lg"
                    @click="$emit('toggleDialog')"
                >
                    Create event
                </n-button>
            </div>
        </div>
    </n-modal>
</template>
