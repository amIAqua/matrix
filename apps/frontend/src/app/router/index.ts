import { createWebHistory, createRouter } from 'vue-router';

import MainScreen from 'src/screens/main/MainScreen.vue';

const routes = [{ path: '/', component: MainScreen, name: 'Main' }];

export const router = createRouter({
    history: createWebHistory(),
    routes,
});
