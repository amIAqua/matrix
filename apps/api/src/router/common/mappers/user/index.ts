import { TDbUser, TUser } from 'src/router/common/types/user';

export const mapDbUserEntityToTUser = (dbUser: TDbUser): TUser => {
    return {
        id: dbUser.id!,
        name: dbUser.name,
        surname: dbUser.surname,
        email: dbUser.email,
        createdAt: dbUser.createdAt,
        avatarUrl: dbUser.avatarUrl ? dbUser.avatarUrl : undefined,
    };
};
