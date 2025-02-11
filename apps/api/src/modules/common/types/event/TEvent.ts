export type TEvent = {
    id: string;
    title?: string;
    description?: string;
    dateTime: string;
    creatorId: string;
    guests: {
        id: string;
        name: string;
        surname: string;
        avatarUrl?: string;
    }[];
};
