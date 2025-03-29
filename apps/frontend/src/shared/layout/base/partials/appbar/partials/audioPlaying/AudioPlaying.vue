<script setup lang="ts">
import SkipPreviousIcon from 'src/shared/custom/icons/audio/SkipPreviousIcon.vue';
import SkipNextIcon from 'src/shared/custom/icons/audio/SkipNextIcon.vue';

import PlayIcon from 'src/shared/custom/icons/audio/PlayIcon.vue';


</script>

<template>
    <div :class="$style['audio-container']">
        <div>
            <p :class="$style['audio-name']">
                2000 миль
            </p>
        </div>

        <div :class="$style.player">
            <SkipPreviousIcon :class="$style['player-icon']" />
            <PlayIcon :class="$style['player-icon']" />
            <SkipNextIcon :class="$style['player-icon']" />
        </div>
    </div>

</template>

<style module>
.audio-container {
    gap: 20px;
    display: flex;
    opacity: 0.3;
    align-items: center;
    color: var(--brand-white);
}

.player {
    gap: 10px;
    font-size: var(--text-md);
    display: flex;
    align-items: center;
}

.player-icon {
    cursor: pointer;
    font-size: 30px;
}

.audio-name {
    font-size: var(--text-sm);
    font-weight: var(--normal);
}
</style>