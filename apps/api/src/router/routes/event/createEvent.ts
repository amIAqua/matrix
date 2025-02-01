import { Context } from 'hono';
import { sql } from 'drizzle-orm';
import { Effect, pipe } from 'effect';
import { db, eventsTable, usersTable } from 'src/db';
import { createRoute } from '@hono/zod-openapi';
import {
    HttpStatusCode,
    THandlerResponse,
    THttpError,
} from 'src/router/common/response';
import {
    createEventSchema,
    eventSchema,
} from 'src/router/routes/event/validation';
import { mapDbEventEntityTEvent } from 'src/router/common/mappers/event';
import { CreateEventDto } from 'src/router/routes/event/types/dto/request';
import { authMiddleware } from 'src/router/common/middlewares/auth';
import { mapDbUserEntityToTUser } from 'src/router/common/mappers/user';
import { InternalServerError } from 'src/router/common/errors';
import { TDbEvent, TEvent } from 'src/router/common/types/event';
import { HTTPException } from 'hono/http-exception';
import { TDbUser } from 'src/router/common/types/user';

export const createEventRoute = createRoute({
    method: 'post',
    path: '/event',
    middleware: authMiddleware(),
    tags: ['event'],
    request: {
        body: {
            content: {
                'application/json': {
                    schema: createEventSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Create new event',
            content: {
                'application/json': {
                    schema: eventSchema,
                },
            },
        },
    },
});

export const createEventHandler = async (
    ctx: Context,
): Promise<THandlerResponse<TEvent, HttpStatusCode.OK>> => {
    const createEventDto: CreateEventDto = await ctx.req.json();

    const getCurrentUserId = Effect.try({
        try: () => {
            return ctx.get('session').user.id as string;
        },
        catch: (error) =>
            new InternalServerError(
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                `Error: createEventHandler.getCurrentUserId - ${error}`,
            ),
    });

    const createEvent = (userId: string) =>
        Effect.tryPromise({
            try: async () => {
                console.log(createEventDto.guestIds);
                const [eventDbResponse] = await db
                    .insert(eventsTable)
                    .values({
                        creatorId: userId,
                        title: createEventDto.title,
                        description: createEventDto.description,
                        dateTime: createEventDto.dateTime,
                        guestIds: createEventDto.guestIds,
                    })
                    .returning();

                return eventDbResponse as TDbEvent;
            },
            catch: (error) =>
                new InternalServerError(
                    HttpStatusCode.INTERNAL_SERVER_ERROR,
                    `Error: createEventHandler.createEvent - ${error}`,
                ),
        });

    const getEvent = (dbEvent: TDbEvent) =>
        Effect.tryPromise({
            try: async () => {
                const [eventDbResponse] = await db
                    .select({
                        eventsTable,
                        guests: sql<TDbUser[]>`json_agg(${usersTable})`,
                    })
                    .from(eventsTable)
                    .leftJoin(
                        usersTable,
                        sql`${usersTable.id}::uuid = ANY(${eventsTable.guestIds}::uuid[])`,
                    )
                    .where(sql`${eventsTable.id} = ${dbEvent.id}`)
                    .groupBy(
                        eventsTable.id,
                        eventsTable.title,
                        eventsTable.description,
                        eventsTable.dateTime,
                        eventsTable.creatorId,
                        eventsTable.guestIds,
                    );

                const guests =
                    eventDbResponse.guests && eventDbResponse.guests.length
                        ? eventDbResponse.guests
                              .filter(Boolean)
                              .map((guest) => mapDbUserEntityToTUser(guest))
                        : [];

                return {
                    ...mapDbEventEntityTEvent(dbEvent),
                    guests,
                };
            },
            catch: (error) => {
                return new InternalServerError(
                    HttpStatusCode.INTERNAL_SERVER_ERROR,
                    `Error: createEventHandler.getEvent - ${error}`,
                );
            },
        });

    const program = pipe(
        getCurrentUserId,
        Effect.flatMap((userId) => createEvent(userId)),
        Effect.andThen(getEvent),
    );

    let event: TEvent;
    try {
        event = await Effect.runPromise(program);
    } catch (error: any) {
        const errorBody: THttpError = JSON.parse(
            (error.message as string) || '{}',
        );

        throw new HTTPException(errorBody.statusCode, {
            message: errorBody.message,
        });
    }

    return ctx.json(event, HttpStatusCode.OK);
};
