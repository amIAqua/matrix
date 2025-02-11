import { TDbEvent } from 'src/modules/common/types/event/TDbEvent';
import { TEvent } from 'src/modules/common/types/event/TEvent';
import { TDbUser } from 'src/modules/common/types/user/TDbUser';

export const mapDbEventEntityTEvent = (
    dbEvent: TDbEvent,
    dbGuests: TDbUser[],
): TEvent => {
    return {
        id: dbEvent.id,
        title: dbEvent.title,
        description: dbEvent.description,
        dateTime: dbEvent.dateTime,
        creatorId: dbEvent.creatorId,
        guests: dbGuests.map((dbGuest) => ({
            id: dbGuest.id,
            name: dbGuest.name,
            surname: dbGuest.surname,
            avatarUrl: dbGuest.avatarUrl,
        })),
    };
};
