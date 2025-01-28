import { Context } from 'hono';
import { sql } from 'drizzle-orm';
import { db, usersTable } from 'src/db';
import { HTTPException } from 'hono/http-exception';
import { createRoute, z as zod } from '@hono/zod-openapi';
import { HttpStatusCode, THandlerResponse } from 'src/router/common/response';
import { TUser } from 'src/router/common/types/user';
import {
    userSchema,
    getUserByIdParams,
} from 'src/router/routes/user/validation';
import { mapDbUserEntityToTUser } from 'src/router/common/mappers/user';
import { authMiddleware } from 'src/router/common/middlewares/auth';

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

    console.log(ctx.get('session'));

    let user: TUser;
    try {
        const [userDbResponse] = await db
            .select()
            .from(usersTable)
            .where(sql`${usersTable.id} = ${userId}`);

        user = mapDbUserEntityToTUser(userDbResponse);
    } catch (error) {
        throw new HTTPException(HttpStatusCode.NOT_FOUND, {
            message: 'User not found.',
        });
    }

    return ctx.json(user, HttpStatusCode.OK);
};
