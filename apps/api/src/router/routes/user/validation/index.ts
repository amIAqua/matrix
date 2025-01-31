import { z as zod } from '@hono/zod-openapi';

export const createUserSchema = zod.object({
    name: zod.string(),
    surname: zod.string(),
    email: zod.string().email(),
    hashedPassword: zod.string(),
    avatarUrl: zod.string().nullable(),
});

export const userSchema = zod.object({
    id: zod.string().openapi({
        title: 'id',
        type: 'string',
        required: ['id'],
    }),
    name: zod.string().openapi({
        title: 'name',
        type: 'string',
        required: ['name'],
    }),
    surname: zod.string().openapi({
        title: 'surname',
        type: 'string',
        required: ['surname'],
    }),
    email: zod
        .string()
        .email()
        .openapi({
            title: 'email',
            type: 'string',
            required: ['email'],
        }),
    avatarUrl: zod.string().optional().openapi({
        title: 'avatarUrl',
        type: 'string',
    }),
    createdAt: zod.coerce.date().openapi({
        title: 'createdAt',
        type: 'string',
        required: ['createdAt'],
    }),
});

export const getUserByIdParams = zod.object({
    id: zod.string().openapi({
        param: {
            name: 'id',
            in: 'path',
        },
    }),
});
