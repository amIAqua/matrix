import { computed, onMounted, ref } from 'vue';

export const useEvents = () => {
    const events = ref<any[]>([]);

    onMounted(() => {
        setTimeout(() => {
            events.value = [
                {
                    id: '123',
                    title: 'Meeting 1',
                    dateTime: new Date().toISOString(),
                },
                {
                    id: '1qweq23',
                    title: 'Meeting 2 suuper meeting',
                    description: 'meeeting 1 description',
                    dateTime: new Date().toISOString(),
                },
                {
                    id: '1ffefe23',
                    description: 'meeeting 3 description',
                    dateTime: new Date().toISOString(),
                },
                {
                    id: '1fffss23',
                    title: 'teeesting meet',
                    dateTime: new Date().toISOString(),
                },
                {
                    id: '12xxxc3',
                    title: 'Meeting 1',
                    description: 'meeeting 1 description',
                    dateTime: new Date().toISOString(),
                },
            ];
        }, 2000);
    });

    const todayEvents = computed(() => {
        console.log(events.value);
        return [];
    });

    return {
        events: events,
        // todayEvents,
    };
};
