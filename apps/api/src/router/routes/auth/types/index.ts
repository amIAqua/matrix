export type LoginUserDto = {
    email: string;
    hashedPassword: string;
};

export type RegisterUserDto = {
    email: string;
    name: string;
    surname: string;
    hashedPassword: string;
    avatarUrl: string | null;
};
