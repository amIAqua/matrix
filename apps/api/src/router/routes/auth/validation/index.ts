import { z as zod } from 'zod';

export const loginUserSchema = zod.object({
    email: zod.string().email(),
    hashedPassword: zod.string(),
});
