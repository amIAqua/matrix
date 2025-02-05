import { TDbEvent } from 'src/modules/common/types/event/TDbEvent';
import { TEvent } from 'src/modules/common/types/event/TEvent';

export const mapDbEventEntityTEvent = (dbEvent: TDbEvent): TEvent => {
    return {
        id: dbEvent.id!,
        title: dbEvent.title,
        description: dbEvent.description,
        dateTime: dbEvent.dateTime,
        creatorId: dbEvent.creatorId,
        guests: [],
    };
};
