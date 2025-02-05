import { sql } from 'drizzle-orm';
import { Effect, pipe } from 'effect';
import { db, eventsTable, usersTable } from 'src/db';
import { HttpStatusCode } from 'src/router/common/response';
import { InternalServerError } from 'src/router/common/errors';
import { TEvent } from 'src/modules/common/types/event/TEvent';
import { TDbUser } from 'src/modules/common/types/user/TDbUser';
import { TDbEvent } from 'src/modules/common/types/event/TDbEvent';
import { CreateEventDto } from 'src/modules/event/api/dto/request/createEventDto';
import { ICreateEventService } from 'src/modules/event/api/interfaces/ICreateEventService';
import { mapDbUserEntityToTUser } from 'src/modules/common/mappers/user/mapDbUserEntityToTUser';
import { mapDbEventEntityTEvent } from 'src/modules/common/mappers/event/mapDbEventEntityTEvent';

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
