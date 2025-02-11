import { Effect, pipe } from 'effect';
import { TEvent } from 'src/modules/common/types/event/TEvent';
import { IGetEventsService } from 'src/modules/event/api/interfaces/IGetEventsService';
import { EventsFilterDto } from 'src/modules/event/api/dto/request/eventsFilterDto';
import { InternalServerError } from 'src/router/common/errors';
import { db, eventsTable, usersTable } from 'src/db';
import { aliasedTable, sql } from 'drizzle-orm';
import { TDbUser } from 'src/modules/common/types/user/TDbUser';
import { HttpStatusCode } from 'src/router/common/response';
import { guestsToEventsTable } from 'src/db/schema';
import { mapDbEventEntityTEvent } from 'src/modules/common/mappers/event/mapDbEventEntityTEvent';

export class GetEventsService implements IGetEventsService {
    private getEventsByFilter(
        filter: EventsFilterDto,
    ): Effect.Effect<TEvent[], InternalServerError, never> {
        return Effect.tryPromise({
            try: async () => {
                const guestsTable = aliasedTable(usersTable, 'guestsTable');

                const eventsDbResponse = await db
                    .select({
                        id: eventsTable.id,
                        title: eventsTable.title,
                        guestIds: eventsTable.guestIds,
                        description: eventsTable.description,
                        dateTime: eventsTable.dateTime,
                        creatorId: eventsTable.creatorId,
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
                    .groupBy(eventsTable.id, usersTable.id)
                    .limit(10);

                return eventsDbResponse.map((dbEvent) =>
                    mapDbEventEntityTEvent(dbEvent, dbEvent.guests),
                );
            },
            catch: (error) => {
                return new InternalServerError(
                    HttpStatusCode.INTERNAL_SERVER_ERROR,
                    `Error: getEventsService.getEventsByFilter - ${error}`,
                );
            },
        });
    }

    public async runProgram(filter: EventsFilterDto): Promise<TEvent[]> {
        const program = pipe(this.getEventsByFilter(filter));

        return await Effect.runPromise(program);
    }
}
