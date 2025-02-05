import { sql } from 'drizzle-orm';
import { Effect, pipe } from 'effect';
import { db, usersTable } from 'src/db';
import { HttpStatusCode } from 'src/router/common/response';
import { TUser } from 'src/modules/common/types/user/TUser';
import { TDbUser } from 'src/modules/common/types/user/TDbUser';
import { InternalServerError, NotFoundError } from 'src/router/common/errors';
import { IUserGetByIdService } from 'src/modules/user/api/interfaces/IUserGetByIdService';
import { mapDbUserEntityToTUser } from 'src/modules/common/mappers/user/mapDbUserEntityToTUser';

export class UserGetByIdService implements IUserGetByIdService {
    private userByIdDbResponse(
        userId: string,
    ): Effect.Effect<TDbUser, InternalServerError | NotFoundError, never> {
        return Effect.tryPromise({
            try: async () => {
                const [userDbResponse] = await db
                    .select()
                    .from(usersTable)
                    .where(sql`${usersTable.id} = ${userId}`);
                if (!userDbResponse) {
                    throw new NotFoundError(
                        HttpStatusCode.NOT_FOUND,
                        `User with id ${userId} was not found`,
                    );
                }
                return userDbResponse as TDbUser;
            },
            catch: (error) => {
                if (error instanceof NotFoundError) return error;
                return new InternalServerError(
                    HttpStatusCode.INTERNAL_SERVER_ERROR,
                    'Internal server error. Please, try again later',
                );
            },
        });
    }

    public async runProgram(userId: string): Promise<TUser> {
        const program = pipe(
            this.userByIdDbResponse(userId),
            Effect.map(mapDbUserEntityToTUser),
        );

        return await Effect.runPromise(program);
    }
}
