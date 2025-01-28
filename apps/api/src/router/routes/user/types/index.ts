export type CreateUserDto = {
    name: string;
    email: string;
    surname: string;
    hashedPassword: string;
    avatarUrl: string | null;
};
