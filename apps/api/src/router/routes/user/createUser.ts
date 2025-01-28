import { Context } from 'hono';
import { db, usersTable } from 'src/db';
import { Effect, pipe } from 'effect';
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
    createUserSchema,
} from 'src/router/routes/user/validation';
import { CreateUserDto } from 'src/router/routes/user/types';
import { authMiddleware } from 'src/router/common/middlewares/auth';
import { mapDbUserEntityToTUser } from 'src/router/common/mappers/user';
import { InternalServerError, NotFoundError } from 'src/router/common/errors';

export const createUserRoute = createRoute({
    method: 'post',
    path: '/user',
    middleware: authMiddleware(),
    tags: ['user'],
    request: {
        body: {
            content: {
                'application/json': {
                    schema: createUserSchema,
                },
            },
            required: true,
        },
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

export const createUserHandler = async (
    ctx: Context,
): Promise<THandlerResponse<any, HttpStatusCode.OK>> => {
    const createUserDto: CreateUserDto = await ctx.req.json();

    let user: TUser;
    const createdUserDbResponse = Effect.tryPromise({
        try: async () => {
            const [userDbResponse] = await db
                .insert(usersTable)
                .values({
                    name: createUserDto.name,
                    email: createUserDto.email,
                    surname: createUserDto.surname,
                    avatarUrl: createUserDto.avatarUrl
                        ? createUserDto.avatarUrl
                        : null,
                    hashedPassword: createUserDto.hashedPassword,
                })
                .returning();

            if (!userDbResponse) {
                throw new NotFoundError(
                    HttpStatusCode.NOT_FOUND,
                    `User with email ${createUserDto.email} was not found`,
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

    const effect = pipe(
        createdUserDbResponse,
        Effect.map(mapDbUserEntityToTUser),
    );

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
