import { Context } from 'hono';
import { sign } from 'hono/jwt';
import { sql } from 'drizzle-orm';
import { pbkdf2Sync, randomBytes } from 'node:crypto';
import { setCookie } from 'hono/cookie';
import { db, usersTable } from 'src/db';
import { appConfig } from 'src/app/config';
import { HTTPException } from 'hono/http-exception';
import { createRoute, z as zod } from '@hono/zod-openapi';
import { LoginUserDto } from 'src/router/routes/auth/types';
import { loginUserSchema } from 'src/router/routes/auth/validation';
import { mapDbUserEntityToTUser } from 'src/router/common/mappers/user';
import { HttpStatusCode, THandlerResponse } from 'src/router/common/response';

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
    let loggedIn = false;

    const [userDbResponse] = await db
        .select()
        .from(usersTable)
        .where(sql`${usersTable.email} = ${loginDto.email}`);

    if (!userDbResponse) {
        throw new HTTPException(HttpStatusCode.NOT_FOUND, {
            message: `User with email ${loginDto.email} was not found`,
        });
    }

    const userFromDbPassword = userDbResponse.hashedPassword;
    const loginDtoPassword = loginDto.hashedPassword;

    // // this is in register method
    // const salt = randomBytes(32).toString('hex');
    // const genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')

    // // this is in login method
    // const checkHash = pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex')

    if (userFromDbPassword !== loginDtoPassword) {
        throw new HTTPException(HttpStatusCode.CLIENT_ERROR, {
            message: `Wrong password! Mismatch...`,
        });
    }

    const sessionToken = await sign(
        {
            loggedInAt: new Date().toISOString(),
            user: mapDbUserEntityToTUser(userDbResponse),
            exp: Math.floor(Date.now() / 1000) + 60 * 20,
        },
        appConfig.ENCRYPTION_SESSION_KEY,
    );

    loggedIn = true;
    setCookie(ctx, appConfig.SESSION_COOKIE_NAME, sessionToken, {
        httpOnly: true,
        path: '/',
        domain: 'localhost',
    });

    return ctx.json({ loggedIn }, HttpStatusCode.OK);
};
