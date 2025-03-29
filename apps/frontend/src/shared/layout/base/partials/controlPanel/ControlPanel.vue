<script setup lang="ts">
import Home from 'src/shared/custom/icons/services/buttons/Home.vue';

</script>

<template>
    <div :class="$style['control-panel']">

        <Home :class="$style['home-button']" />
    </div>
</template>

<style lang="css" module>
.control-panel {
    z-index: 2;
    width: 100%;
    bottom: 0;
    height: 84px;
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    background: rgba(var(--brand-dark-rgba), 0.6);
}

.home-button {
    cursor: pointer;
    font-size: 52px;
    opacity: 0.5;
    color: var(--brand-white);
}
</style>