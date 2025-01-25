import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';
import { appConfig } from 'src/app/config';

export default defineConfig({
    out: './drizzle',
    schema: './src/db/schema',
    dialect: 'postgresql',
    dbCredentials: {
        url: appConfig.DATABASE_URL,
    },
});
