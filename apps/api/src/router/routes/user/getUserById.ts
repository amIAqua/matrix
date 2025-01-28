import { Context } from 'hono';
import { sql } from 'drizzle-orm';
import { Effect, pipe } from 'effect';
import { db, usersTable } from 'src/db';
import { HTTPException } from 'hono/http-exception';
import { createRoute } from '@hono/zod-openapi';
import {
    HttpStatusCode,
    THandlerResponse,
    THttpError,
} from 'src/router/common/response';
import { TDbUser, TUser } from 'src/router/common/types/user';
import {
    userSchema,
    getUserByIdParams,
} from 'src/router/routes/user/validation';
import { authMiddleware } from 'src/router/common/middlewares/auth';
import { mapDbUserEntityToTUser } from 'src/router/common/mappers/user';
import { InternalServerError, NotFoundError } from 'src/router/common/errors';

export const getUserByIdRoute = createRoute({
    method: 'get',
    path: '/user/{id}',
    middleware: authMiddleware(),
    tags: ['user'],
    request: {
        params: getUserByIdParams,
    },
    responses: {
        200: {
            description: 'Create new user',
            content: {
                'application/json': {
                    schema: userSchema,
                },
            },
        },
    },
});

export const getUserByIdHandler = async (
    ctx: Context,
): Promise<THandlerResponse<TUser, HttpStatusCode.OK>> => {
    const userId: string = ctx.req.param('id');

    let user: TUser;
    const userByIdDbResponse = Effect.tryPromise({
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
                'Internal server error...Please, try again later',
            );
        },
    });

    const effect = pipe(userByIdDbResponse, Effect.map(mapDbUserEntityToTUser));

    try {
        user = await Effect.runPromise(effect);
    } catch (error: any) {
        const errorBody: THttpError = JSON.parse(
            (error.message as string) || '{}',
        );

        throw new HTTPException(errorBody.statusCode, {
            message: errorBody.message,
        });
    }

    return ctx.json(user, HttpStatusCode.OK);
};
