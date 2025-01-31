import { z as zod } from '@hono/zod-openapi';

export const loginUserRequestSchema = zod.object({
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
});

export const userLoggedInResponseSchema = zod.object({
    loggedIn: zod.boolean().openapi({
        title: 'loggedIn',
        type: 'boolean',
    }),
});
