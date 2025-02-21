import { createWebHistory, createRouter } from 'vue-router';

import HomePage from 'src/page/home/HomePage.vue';
import EventsPage from 'src/page/events/EventsPage.vue';

const routes = [
    { path: '/', component: HomePage, name: 'Home' },
    { path: '/events', component: EventsPage, name: 'Events' },
];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});
