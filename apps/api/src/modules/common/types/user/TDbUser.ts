export type TDbUser = {
    email: string;
    name: string;
    id: string | null;
    surname: string;
    hashedPassword: string;
    avatarUrl: string | null;
    createdAt: string;
};
