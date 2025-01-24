<script setup lang="ts">
import {
    SidebarProvider,
    SidebarTrigger,
} from 'src/shared/uikit/components/sidebar';
import Sidebar from 'src/shared/layout/base/partials/sidebar/Sidebar.vue';
</script>

<template>
    <SidebarProvider>
        <Sidebar />
        <main class="p-3">
            <SidebarTrigger />
            <div>
                <slot />
            </div>
        </main>
    </SidebarProvider>
</template>