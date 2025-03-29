import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { PiniaColada } from '@pinia/colada';
import App from 'src/app/App.vue';
import { router } from 'src/app/router';
import 'src/app/assets/css/global.css';

const app = createApp(App);
app.use(router);
app.use(createPinia());
app.use(PiniaColada);

app.mount('#app');
