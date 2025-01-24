<script setup lang="ts">
import { Calendar } from "lucide-vue-next";

interface IProps {
    isCollapsed: boolean;
}
defineProps<IProps>();
</script>

<template>
    <div class="flex items-center gap-2">
        <div class="w-7 h-7 flex bg-red-500 rounded-lg justify-center items-center">
            <Calendar width="18" color="white" class="logo-icon-svg" />
        </div>

        <div v-if="!isCollapsed">
            <h3 class="font-semibold">Matrix</h3>
        </div>
    </div>
</template>

<style lang="css" scoped>
.logo-icon-svg {
    padding-bottom: 1px;
    padding-left: 0.5px;
}
</style>