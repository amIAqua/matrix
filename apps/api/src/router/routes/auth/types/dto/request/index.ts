export type LoginUserDto = {
    email: string;
    passwordHash: string;
};

export type RegisterUserDto = {
    name: string;
    surname: string;
    email: string;
    passwordHash: string;
    avatarUrl?: string;
};
