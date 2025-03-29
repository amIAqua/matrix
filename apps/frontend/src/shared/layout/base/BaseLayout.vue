<script setup lang="ts">
import AppBar from 'src/shared/layout/base/partials/appbar/AppBar.vue';
import ControlPanel from 'src/shared/layout/base/partials/controlPanel/ControlPanel.vue';
</script>

<template>
    <div :class="$style.layout">
        <AppBar />


        <ControlPanel />
    </div>

    <div :class="$style['layout-dark-mask']" />
</template>

<style lang="css" module>
.layout {
    height: 100vh;
    width: 100%;
    position: relative;
    background: rgb(103, 122, 192);
    background: linear-gradient(33deg, rgba(103, 122, 192, 1) 7%, rgba(196, 111, 140, 1) 30%, rgba(196, 111, 140, 1) 33%, rgba(46, 65, 137, 1) 70%, rgba(14, 17, 30, 1) 100%);
}

.layout-dark-mask {
    height: 100vh;
    width: 100%;
    top: 0;
    opacity: .6;
    position: absolute;
    background: var(--brand-dark);
}
</style>