export type LoginUserDto = {
    email: string;
    passwordHash: string;
};

export type RegisterUserDto = {
    email: string;
    name: string;
    surname: string;
    passwordHash: string;
    avatarUrl: string | null;
};
