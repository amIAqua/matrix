import { z as zod } from 'zod';
import 'dotenv/config';

const envSchema = zod.object({
    PORT: zod.string(),
    DATABASE_URL: zod.string(),
    // SESSION_COOKIE_NAME: zod.string(),
    // ENCRYPTION_SESSION_KEY: zod.string(),
});

export const appConfig = envSchema.parse({
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    // SESSION_COOKIE_NAME: process.env.SESSION_COOKIE_NAME,
    // ENCRYPTION_SESSION_KEY: process.env.ENCRYPTION_SESSION_KEY,
});
