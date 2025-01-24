import { createApp } from 'vue';
import App from 'src/app/App.vue';
import { router } from 'src/app/router';
import 'src/app/assets/css/global.css';

const app = createApp(App);
app.use(router);

app.mount('#app');
