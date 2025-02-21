<script setup lang="ts">
import { useRoute } from 'vue-router';
import { BrowsersOutline, HomeOutline, CalendarClearOutline } from '@vicons/ionicons5';

const route = useRoute();

const menuItems = [
    {
        id: 'home',
        title: 'Home',
        to: '/',
        icon: HomeOutline,
    },
    {
        id: 'events',
        title: 'Events',
        to: '/events',
        icon: CalendarClearOutline,
    }
];
</script>

<template>
    <div class="w-full h-full bg-stone-100">
        <div class="p-[14px] ">
            <RouterLink to="/">
                <div class="flex items-center gap-1 mb-[30px]">
                    <div>
                        <BrowsersOutline class="w-[24px] text-black" />
                    </div>
                    <h1 class="text-black font-semibold text-lg">Matrix</h1>
                </div>
            </RouterLink>

            <div class="flex flex-col">
                <RouterLink v-for="item of menuItems" :to="item.to" :key="item.id">
                    <div :class="{
                        'border-stone-200 border-solid border-[1px] bg-white rounded-lg': item.to === route.path,
                        'border-transparent border-solid border-[1px]': item.to !== route.path,
                    }"
                        class="flex items-center gap-2 py-[10px] px-[12px]  hover:bg-white hover:rounded-lg hover:border-stone-200 hover:border-solid hover:border-[1px]">
                        <component :is="item.icon" class="w-[22px]" />

                        <p class="font-semibold text-[16px]">{{ item.title }}</p>
                    </div>
                </RouterLink>
            </div>
        </div>
    </div>
</template>