import { Context } from 'hono';
import { sign } from 'hono/jwt';
import { compare } from 'bcrypt';
import { sql } from 'drizzle-orm';
import { Effect, pipe } from 'effect';
import { setCookie } from 'hono/cookie';
import { db, usersTable } from 'src/db';
import { appConfig } from 'src/app/config';
import { createRoute } from '@hono/zod-openapi';
import { HTTPException } from 'hono/http-exception';
import { TUser } from 'src/modules/common/types/user/TUser';
import { TDbUser } from 'src/modules/common/types/user/TDbUser';
import { LoginUserDto } from 'src/router/routes/auth/types/dto/request';
import {
    loginUserRequestSchema,
    userLoggedInResponseSchema,
} from 'src/router/routes/auth/validation/login';
import { mapDbUserEntityToTUser } from 'src/modules/common/mappers/user/mapDbUserEntityToTUser';
import {
    ClientError,
    InternalServerError,
    NotFoundError,
} from 'src/router/common/errors';
import {
    HttpStatusCode,
    THandlerResponse,
    THttpError,
} from 'src/router/common/response';

export const loginRoute = createRoute({
    method: 'post',
    path: 'auth/login',
    tags: ['auth'],
    request: {
        body: {
            content: {
                'application/json': {
                    schema: loginUserRequestSchema,
                },
            },
            required: true,
        },
    },
    responses: {
        200: {
            description: 'Login user and create session',
            content: {
                'application/json': {
                    schema: userLoggedInResponseSchema,
                },
            },
        },
    },
});

export const loginHandler = async (
    ctx: Context,
): Promise<THandlerResponse<{ loggedIn: boolean }, HttpStatusCode.OK>> => {
    const loginDto: LoginUserDto = await ctx.req.json();

    const getUserFromDb = Effect.tryPromise({
        try: async () => {
            const [userDbResponse] = await db
                .select()
                .from(usersTable)
                .where(sql`${usersTable.email} = ${loginDto.email}`);

            if (!userDbResponse) {
                throw new NotFoundError(
                    HttpStatusCode.NOT_FOUND,
                    `User with email ${loginDto.email} was not found`,
                );
            }

            return userDbResponse as TDbUser;
        },
        catch: (error) => {
            if (error instanceof NotFoundError) return error;

            return new InternalServerError(
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                `Error: loginHandler.getUserFromDb - ${error}`,
            );
        },
    });

    const comparePasswords = (dbUser: TDbUser) =>
        Effect.tryPromise({
            try: async () => {
                const arePasswordsMatch = await compare(
                    loginDto.passwordHash,
                    dbUser.hashedPassword,
                );

                if (!arePasswordsMatch) {
                    throw new ClientError(
                        HttpStatusCode.CLIENT_ERROR,
                        'Wrong password. Passwords do not match',
                    );
                }

                return dbUser;
            },
            catch: (error) =>
                new InternalServerError(
                    HttpStatusCode.INTERNAL_SERVER_ERROR,
                    `Password validation failed - ${error}`,
                ),
        });

    const createSession = (user: TUser) =>
        Effect.tryPromise({
            try: async () => {
                return await sign(
                    {
                        user,
                        loggedInAt: new Date().toISOString(),
                        exp: Math.floor(Date.now() / 1000) + 60 * 20,
                    },
                    appConfig.ENCRYPTION_SESSION_KEY,
                );
            },
            catch: () =>
                new InternalServerError(
                    HttpStatusCode.INTERNAL_SERVER_ERROR,
                    'Authentication token validation failed',
                ),
        });

    const setSessionToken = (sessionToken: string) => {
        setCookie(ctx, appConfig.SESSION_COOKIE_NAME, sessionToken, {
            httpOnly: true,
            path: '/',
            domain: 'localhost',
        });

        return true;
    };

    const program = pipe(
        getUserFromDb,
        Effect.andThen(comparePasswords),
        Effect.map(mapDbUserEntityToTUser),
        Effect.andThen(createSession),
        Effect.map(setSessionToken),
    );

    let loggedIn = false;
    try {
        loggedIn = await Effect.runPromise(program);
    } catch (error: any) {
        const errorBody: THttpError = JSON.parse(
            (error.message as string) || '{}',
        );

        throw new HTTPException(errorBody.statusCode, {
            message: errorBody.message,
        });
    }

    return ctx.json({ loggedIn }, HttpStatusCode.OK);
};
