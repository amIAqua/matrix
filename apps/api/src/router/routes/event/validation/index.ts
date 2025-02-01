import { z as zod } from '@hono/zod-openapi';

const baseEventSchema = zod.object({
    title: zod.string().optional().openapi({
        title: 'title',
        type: 'string',
    }),
    dateTime: zod.coerce.date().openapi({
        title: 'dateTime',
        type: 'string',
        required: ['dateTime'],
    }),
    description: zod.string().optional().openapi({
        title: 'description',
        type: 'string',
    }),
});

export const createEventSchema = zod.object({
    ...baseEventSchema.shape,
    guestIds: zod.array(zod.string()).optional().openapi({
        title: 'guestIds',
        type: 'array',
    }),
});

export const eventSchema = zod.object({
    ...baseEventSchema.shape,
    guests: zod.array(
        zod.object({
            id: zod.string().openapi({
                title: 'id',
                type: 'string',
            }),
            name: zod.string().openapi({
                title: 'name',
                type: 'string',
            }),
        }),
    ),
});
