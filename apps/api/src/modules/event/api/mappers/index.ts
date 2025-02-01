import { TDbEvent, TEvent } from 'src/router/common/types/event';

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
