export type TDbEvent = {
    id: string | null;
    title?: string;
    description?: string;
    dateTime: string;
    creatorId: string;
    guestIds: string[];
};
