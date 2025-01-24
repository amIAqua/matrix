<script setup lang="ts">
import { routes } from 'src/shared/layout/base/partials/sidebar/routes';
import Logo from 'src/shared/layout/base/partials/appbar/partials/logo/Logo.vue';

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarHeader,
    SidebarFooter,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar
} from 'src/shared/uikit/components/sidebar';

const { state } = useSidebar();

</script>

<template>
    <Sidebar class="p-3" collapsible="icon">
        <SidebarHeader class="pb-2">
            <div class="flex items-center justify-between">
                <RouterLink to="/">
                    <Logo :isCollapsed="state === 'collapsed'" />

                </RouterLink>
            </div>
        </SidebarHeader>

        <SidebarContent>
            <div class="divider" />

            <SidebarGroup>
                <SidebarGroupContent>
                    <SidebarMenu>
                        <SidebarMenuItem v-for="route in routes" :key="route.title">
                            <SidebarMenuButton asChild variant="default">
                                <RouterLink :to="route.url">
                                    <component :is="route.icon" />
                                    <span>{{ route.title }}</span>
                                </RouterLink>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarGroupContent>
            </SidebarGroup>
        </SidebarContent>
        <SidebarFooter />
    </Sidebar>
</template>

<style lang="css" scoped>
.divider {
    margin-top: 1rem;
    margin-bottom: 1rem;
}
</style>