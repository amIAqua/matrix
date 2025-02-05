import { TUser } from 'src/modules/common/types/user/TUser';
import { TDbUser } from 'src/modules/common/types/user/TDbUser';

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
