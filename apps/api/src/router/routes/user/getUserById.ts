import { Context } from 'hono';
import { sql } from 'drizzle-orm';
import { db, usersTable } from 'src/db';
import { HTTPException } from 'hono/http-exception';
import { createRoute, z as zod } from '@hono/zod-openapi';
import { HttpStatusCode, THandlerResponse } from 'src/router/common/response';
import {
    userSchema,
    TUser,
    getUserByIdParams,
} from 'src/router/routes/user/types';

export const getUserByIdRoute = createRoute({
    method: 'get',
    path: '/user/{id}',
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
    try {
        const users = await db
            .select()
            .from(usersTable)
            .where(sql`${usersTable.id} = ${userId}`);

        user = {
            ...users[0],
            createdAt: users[0].createdAt.toISOString(),
        };
    } catch (error) {
        throw new HTTPException(HttpStatusCode.NOT_FOUND, {
            message: 'User not found.',
        });
    }

    return ctx.json(user, HttpStatusCode.OK);
};
