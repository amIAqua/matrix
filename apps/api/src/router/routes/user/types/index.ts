import { z as zod } from 'zod';

export type TUser = {
    id: string | null;
    name: string;
    surname: string;
    email: string;
    avatarUrl: string | null;
    createdAt: string;
};

export const createUserSchema = zod.object({
    name: zod.string(),
    surname: zod.string(),
    email: zod.string().email(),
    avatarUrl: zod.string().nullable(),
});

export const userSchema = zod.object({
    id: zod.string().nullable(),
    name: zod.string(),
    surname: zod.string(),
    email: zod.string().email(),
    avatarUrl: zod.string().nullable(),
    createdAt: zod.coerce.date(),
});

export const getUserByIdParams = zod.object({
    id: zod.string(),
});
