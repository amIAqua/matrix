<script setup lang="ts">
import { NLayout, NLayoutContent, NLayoutSider } from 'naive-ui';
// import AppBar from 'src/shared/layout/base/partials/appbar/AppBar.vue';
import Sidebar from 'src/shared/layout/base/partials/sidebar/Sidebar.vue';
</script>

<template>
    <n-layout has-sider class="h-screen">
        <n-layout-sider class="hidden md:block" width="300px">
            <Sidebar />
        </n-layout-sider>
        <n-layout class="p-[10px] bg-stone-100">
            <!-- <n-layout-header>
                <AppBar />

            </n-layout-header> -->
            <n-layout-content class="bg-stone-100">
                <main>
                    <div class=" bg-white rounded-[20px] p-[30px] border-solid border-[1px] border-stone-200">
                        <div class="mb-[30px]">
                            breadcrumbs
                        </div>


                        <slot />
                    </div>
                </main>
            </n-layout-content>
        </n-layout>
    </n-layout>
</template>