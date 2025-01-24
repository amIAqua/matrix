import { createWebHistory, createRouter } from 'vue-router';

import HomePage from 'src/page/home/HomePage.vue';
import CalendarPage from 'src/page/calendar/CalendarPage.vue';

const routes = [
    { path: '/', component: HomePage },
    { path: '/calendar', component: CalendarPage },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});
