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
    id: zod.string().uuid(),
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

export const eventsFilterSchema = zod.object({
    dateFrom: zod.coerce.date().optional().openapi({
        title: 'dateFrom',
        type: 'string',
    }),
    dateTo: zod.coerce.date().optional().openapi({
        title: 'dateTo',
        type: 'string',
    }),
    fulltext: zod.string().optional().openapi({
        title: 'fulltext',
        type: 'string',
    }),
});

export const getEventsResponseSchema = zod.object({
    data: zod.array(eventSchema),
});
