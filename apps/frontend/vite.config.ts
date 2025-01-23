import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'node:path';
import autoprefixer from 'autoprefixer';
import tailwind from 'tailwindcss';

export default defineConfig({
    css: {
        postcss: {
            plugins: [tailwind(), autoprefixer()],
        },
    },
    plugins: [vue()],
    resolve: {
        alias: [{ find: 'src', replacement: path.resolve(__dirname, 'src') }],
    },
});
