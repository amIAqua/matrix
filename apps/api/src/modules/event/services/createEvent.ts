import { Effect, pipe } from 'effect';
import { sql, aliasedTable } from 'drizzle-orm';
import { guestsToEventsTable } from 'src/db/schema';
import { db, eventsTable, usersTable } from 'src/db';
import { HttpStatusCode } from 'src/router/common/response';
import { InternalServerError } from 'src/router/common/errors';
import { TEvent } from 'src/modules/common/types/event/TEvent';
import { TDbUser } from 'src/modules/common/types/user/TDbUser';
import { TDbEvent } from 'src/modules/common/types/event/TDbEvent';
import { CreateEventDto } from 'src/modules/event/api/dto/request/createEventDto';
import { ICreateEventService } from 'src/modules/event/api/interfaces/ICreateEventService';
import { mapDbEventEntityTEvent } from 'src/modules/common/mappers/event/mapDbEventEntityTEvent';

export class CreateEventService implements ICreateEventService {
    private createEvent(
        userId: string,
        createEventDto: CreateEventDto,
    ): Effect.Effect<TDbEvent, InternalServerError, never> {
        return Effect.tryPromise({
            try: async () => {
                const guestIds = createEventDto.guestIds;

                return await db.transaction(async (tx) => {
                    const [eventDbResponse] = await tx
                        .insert(eventsTable)
                        .values({
                            creatorId: userId,
                            title: createEventDto.title,
                            description: createEventDto.description,
                            dateTime: createEventDto.dateTime,
                            guestIds: createEventDto.guestIds,
                        })
                        .returning();

                    if (guestIds && guestIds.length) {
                        await tx.insert(guestsToEventsTable).values(
                            createEventDto.guestIds.map((guestId) => ({
                                guestId,
                                eventId: eventDbResponse.id,
                            })),
                        );
                    }

                    return eventDbResponse as TDbEvent;
                });
            },
            catch: (error) =>
                new InternalServerError(
                    HttpStatusCode.INTERNAL_SERVER_ERROR,
                    `Error: createEventService.createEvent - ${error}`,
                ),
        });
    }

    private getEvent(
        dbEvent: TDbEvent,
    ): Effect.Effect<TEvent, InternalServerError, never> {
        return Effect.tryPromise({
            try: async () => {
                const guestsTable = aliasedTable(usersTable, 'guestsTable');

                const [eventDbResponse] = await db
                    .select({
                        id: eventsTable.id,
                        title: eventsTable.title,
                        description: eventsTable.description,
                        dateTime: eventsTable.dateTime,
                        creator: {
                            id: usersTable.id,
                            name: usersTable.name,
                            email: usersTable.email,
                        },
                        guests: sql<TDbUser[]>`json_agg(json_build_object(
                            'id', ${guestsTable.id},
                            'name', ${guestsTable.name},
                            'email', ${guestsTable.email},
                            'surname', ${guestsTable.surname},
                            'createdAt', ${guestsTable.createdAt},
                            'avatarUrl', ${guestsTable.avatarUrl},
                            'hashedPassword', ${guestsTable.hashedPassword}
                        ))`,
                    })
                    .from(eventsTable)
                    .leftJoin(
                        usersTable,
                        sql`${eventsTable.creatorId} = ${usersTable.id}`,
                    )
                    .leftJoin(
                        guestsToEventsTable,
                        sql`${eventsTable.id} = ${guestsToEventsTable.eventId}`,
                    )
                    .leftJoin(
                        guestsTable,
                        sql`${guestsToEventsTable.guestId} = ${guestsTable.id}`,
                    )
                    .where(sql`${eventsTable.id} = ${dbEvent.id}`)
                    .groupBy(eventsTable.id, usersTable.id);

                return {
                    ...mapDbEventEntityTEvent(dbEvent, eventDbResponse.guests),
                };
            },
            catch: (error) => {
                return new InternalServerError(
                    HttpStatusCode.INTERNAL_SERVER_ERROR,
                    `Error: createEventService.getEvent - ${error}`,
                );
            },
        });
    }

    public async runProgram(
        userId: string,
        createEventDto: CreateEventDto,
    ): Promise<TEvent> {
        const program = pipe(
            this.createEvent(userId, createEventDto),
            Effect.andThen(this.getEvent),
        );

        return await Effect.runPromise(program);
    }
}
