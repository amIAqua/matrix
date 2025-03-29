<template>
    <div>
        <p :class="$style.temperature">21&deg;C</p>
    </div>
</template>

<style module>
.temperature {
    opacity: 0.3;
    color: var(--brand-white);
}
</style>