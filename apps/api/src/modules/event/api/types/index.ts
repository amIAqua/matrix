export type TDbEvent = {
    id: string | null;
    title?: string;
    description?: string;
    dateTime: string;
    creatorId: string;
    guestIds: string[];
};

export type TEvent = {
    id: string;
    title?: string;
    description?: string;
    dateTime: string;
    creatorId: string;
    guests: {
        id: string;
        name: string;
    }[];
};
