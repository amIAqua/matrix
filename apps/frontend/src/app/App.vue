<script setup lang="ts">
import { NConfigProvider } from 'naive-ui';
import type { GlobalThemeOverrides } from 'naive-ui';

const themeOverrides: GlobalThemeOverrides = {
    Input: {
        borderFocus: '2px solid #222',
        borderHover: '1px solid #222',
        boxShadowFocus: 'none'
    }
};

</script>

<template>
    <n-config-provider :theme-overrides="themeOverrides">
        <RouterView />
    </n-config-provider>
</template>