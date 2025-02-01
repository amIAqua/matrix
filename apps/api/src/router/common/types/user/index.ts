export type TDbUser = {
    email: string;
    name: string;
    id: string | null;
    surname: string;
    hashedPassword: string;
    avatarUrl: string | null;
    createdAt: string;
};

export type TUser = {
    id: string;
    name: string;
    surname: string;
    email: string;
    createdAt: string;
    avatarUrl?: string;
};
