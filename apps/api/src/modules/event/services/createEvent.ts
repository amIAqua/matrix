import { sql } from 'drizzle-orm';
import { Effect, pipe } from 'effect';
import { db, eventsTable, usersTable } from 'src/db';
// move to modules
import { TDbUser } from 'src/router/common/types/user';
import { HttpStatusCode } from 'src/router/common/response';
import { InternalServerError } from 'src/router/common/errors';
import { TDbEvent, TEvent } from 'src/modules/event/api/types';
import { CreateEventDto } from 'src/modules/event/api/dto/request';
import { ICreateEventService } from 'src/modules/event/api/interfaces';
// move to modules
import { mapDbUserEntityToTUser } from 'src/router/common/mappers/user';
import { mapDbEventEntityTEvent } from 'src/modules/event/api/mappers';

export class CreateEventService implements ICreateEventService {
    private createEvent(
        userId: string,
        createEventDto: CreateEventDto,
    ): Effect.Effect<TDbEvent, InternalServerError, never> {
        return Effect.tryPromise({
            try: async () => {
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
    }

    private getEvent(
        dbEvent: TDbEvent,
    ): Effect.Effect<TEvent, InternalServerError, never> {
        return Effect.tryPromise({
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
