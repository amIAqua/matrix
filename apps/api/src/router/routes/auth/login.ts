import { Context } from 'hono';
import { sql } from 'drizzle-orm';
import { db, usersTable } from 'src/db';
import { HTTPException } from 'hono/http-exception';
import { createRoute, z as zod } from '@hono/zod-openapi';
import { HttpStatusCode, THandlerResponse } from 'src/router/common/response';
import { LoginUserDto } from 'src/router/routes/auth/types';
import { loginUserSchema } from 'src/router/routes/auth/validation';

export const loginRoute = createRoute({
    method: 'post',
    path: '/login',
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

    console.log(loginDto);

    return ctx.json({ loggedIn }, HttpStatusCode.OK);
};
