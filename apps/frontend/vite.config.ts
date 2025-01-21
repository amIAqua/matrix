import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';

export default defineConfig({
    plugins: [vue()],
    resolve: {
        alias: [{ find: 'src', replacement: path.resolve(__dirname, 'src') }],
    },
});
