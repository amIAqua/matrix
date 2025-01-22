import { createApp } from 'vue';
import App from 'src/App.vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import 'src/app/styles/global.css';

const app = createApp(App);

app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});

app.mount('#app');
