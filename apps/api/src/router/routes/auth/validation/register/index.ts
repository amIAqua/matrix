import { z as zod } from '@hono/zod-openapi';

export const registerUserSchema = zod.object({
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
    passwordHash: zod.string().openapi({
        title: 'passwordHash',
        type: 'string',
        required: ['passwordHash'],
    }),
    avatarUrl: zod.string().optional().openapi({
        title: 'avatarUrl',
        type: 'string',
    }),
});

export const userRegisteredResponseSchema = zod.object({
    created: zod.boolean().openapi({
        title: 'created',
        type: 'boolean',
    }),
    userId: zod.string().openapi({
        title: 'userId',
        type: 'string',
    }),
});
