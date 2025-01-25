import 'dotenv/config';
import { z as zod } from 'zod';

const envSchema = zod.object({
    PORT: zod.string(),
    DATABASE_URL: zod.string(),
});

export const appConfig = envSchema.parse({
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
});
