<script setup lang="ts">
import Icon5G from 'src/shared/custom/icons/services/signal/5GIcon.vue';
import BluetoothIcon from 'src/shared/custom/icons/services/BluetoothIcon.vue';
import Temperature from 'src/shared/layout/base/partials/appbar/partials/statusbar/partials/temperature/Temperature.vue';

</script>

<template>
    <div :class="$style['statusbar-container']">
        <Temperature />

        <Icon5G :class="$style['mobile-data']" />

        <BluetoothIcon :class="$style.bluetooth" />
    </div>

</template>

<style module>
.statusbar-container {
    gap: 20px;
    display: flex;
    align-items: center;
    color: var(--brand-white);
}

.mobile-data {
    color: var(--brand-white);
}

.bluetooth {
    color: var(--brand-white);
}
</style>