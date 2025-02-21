<script setup lang="ts">
import BaseLayout from 'src/shared/layout/base/BaseLayout.vue';
import PageTitle from 'src/shared/layout/base/partials/page/partials/title/PageTitle.vue';
import DateTime from 'src/page/events/components/dateTime/DateTime.vue';
import Events from 'src/page/events/components/events/Events.vue';
import EventsActions from 'src/page/events/components/actions/Actions.vue';
</script>

<template>
    <BaseLayout>
        <div class="flex justify-between items-center mb-[5px]">
            <PageTitle />

            <DateTime />
        </div>

        <div class="mb-[30px]">
            <EventsActions />
        </div>

        <Events />
    </BaseLayout>
</template>