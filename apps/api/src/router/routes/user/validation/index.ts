import { z as zod } from 'zod';

export const createUserSchema = zod.object({
    name: zod.string(),
    surname: zod.string(),
    email: zod.string().email(),
    hashedPassword: zod.string(),
    avatarUrl: zod.string().nullable(),
});

export const userSchema = zod.object({
    id: zod.string(),
    name: zod.string(),
    surname: zod.string(),
    email: zod.string().email(),
    avatarUrl: zod.string().nullable(),
    createdAt: zod.coerce.date(),
});

export const getUserByIdParams = zod.object({
    id: zod.string(),
});
