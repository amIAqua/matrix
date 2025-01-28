import { Context } from 'hono';
import { sign } from 'hono/jwt';
import { sql } from 'drizzle-orm';
import { Effect, pipe } from 'effect';
// import { pbkdf2Sync, randomBytes } from 'node:crypto';
import { setCookie } from 'hono/cookie';
import { db, usersTable } from 'src/db';
import { appConfig } from 'src/app/config';
import { HTTPException } from 'hono/http-exception';
import { createRoute, z as zod } from '@hono/zod-openapi';
import { LoginUserDto } from 'src/router/routes/auth/types';
import { loginUserSchema } from 'src/router/routes/auth/validation';
import { mapDbUserEntityToTUser } from 'src/router/common/mappers/user';
import { InternalServerError, NotFoundError } from 'src/router/common/errors';
import {
    HttpStatusCode,
    THandlerResponse,
    THttpError,
} from 'src/router/common/response';
import { TDbUser, TUser } from 'src/router/common/types/user';

export const loginRoute = createRoute({
    method: 'post',
    path: 'auth/login',
    tags: ['auth'],
    request: {
        body: {
            content: {
                'application/json': {
                    schema: loginUserSchema,
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
                    schema: zod.object({
                        loggedIn: zod.boolean(),
                    }),
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
                    `User with email ${loginDto.email} was not found.`,
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
                new HTTPException(HttpStatusCode.INTERNAL_SERVER_ERROR, {
                    message: `Authentication token parse fails...`,
                }),
        });

    const setSessionToken = (sessionToken: string) => {
        setCookie(ctx, appConfig.SESSION_COOKIE_NAME, sessionToken, {
            httpOnly: true,
            path: '/',
            domain: 'localhost',
        });

        return true;
    };

    const effect = pipe(
        getUserFromDb,
        Effect.map(mapDbUserEntityToTUser),
        Effect.andThen(createSession),
        Effect.map(setSessionToken),
    );

    let loggedIn = false;
    try {
        loggedIn = await Effect.runPromise(effect);
    } catch (error: any) {
        const errorBody: THttpError = JSON.parse(
            (error.message as string) || '{}',
        );

        throw new HTTPException(errorBody.statusCode, {
            message: errorBody.message,
        });
    }

    // const userFromDbPassword = userDbResponse.hashedPassword;
    // const loginDtoPassword = loginDto.hashedPassword;

    // // this is in register method
    // const salt = randomBytes(32).toString('hex');
    // const genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')

    // // this is in login method
    // const checkHash = pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')

    // if (userFromDbPassword !== loginDtoPassword) {
    //     throw new HTTPException(HttpStatusCode.CLIENT_ERROR, {
    //         message: `Wrong password! Mismatch...`,
    //     });
    // }

    return ctx.json({ loggedIn }, HttpStatusCode.OK);
};
