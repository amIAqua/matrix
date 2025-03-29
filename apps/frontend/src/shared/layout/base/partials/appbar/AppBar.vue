<script setup lang="ts">
import { ref } from 'vue';
import Time from 'src/shared/layout/base/partials/appbar/partials/time/Time.vue';
import AudioPlaying from 'src/shared/layout/base/partials/appbar/partials/audioPlaying/AudioPlaying.vue';
import StatusBar from 'src/shared/layout/base/partials/appbar/partials/statusbar/StatusBar.vue';

const isAudioPlaying = ref(false);

</script>

<template>
    <div :class="$style.appbar">
        <div :class="$style['content-left']">
            <Time />
        </div>

        <div :class="$style['content-right']">
            <AudioPlaying v-if="isAudioPlaying" />

            <StatusBar />
        </div>
    </div>

</template>

<style lang="css" module>
.appbar {
    top: 0;
    width: 100%;
    z-index: 2;
    position: fixed;
    height: 54px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: rgba(var(--brand-dark-rgba), 0.3);
}

.content-left {
    padding-left: 20px;
}

.content-right {
    gap: 40px;
    display: flex;
    padding-right: 20px;
    align-items: center;

}
</style>