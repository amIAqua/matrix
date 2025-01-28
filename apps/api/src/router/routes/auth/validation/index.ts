import { z as zod } from 'zod';

export const loginUserSchema = zod.object({
    email: zod.string().email(),
    hashedPassword: zod.string(),
});

export const registerUserSchema = zod.object({
    name: zod.string(),
    surname: zod.string(),
    email: zod.string().email(),
    hashedPassword: zod.string(),
    avatarUrl: zod.string().nullable(),
});
