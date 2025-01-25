import { Context } from 'hono';
import { db, usersTable } from 'src/db';
import { HTTPException } from 'hono/http-exception';
import { createRoute, z as zod } from '@hono/zod-openapi';
import { HttpStatusCode, THandlerResponse } from 'src/router/common/response';
import {
    userSchema,
    createUserSchema,
    TUser,
} from 'src/router/routes/user/types';

export const createUserRoute = createRoute({
    method: 'post',
    path: '/user',
    request: {
        body: {
            content: {
                'application/json': {
                    schema: createUserSchema,
                    example: {
                        name: 'John',
                        surname: 'Doe',
                        email: 'johndoe@gmail.com',
                    },
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
): Promise<THandlerResponse<TUser, HttpStatusCode.OK>> => {
    const createUserDto: Omit<TUser, 'id'> = await ctx.req.json();

    let user: TUser;
    try {
        const users = await db
            .insert(usersTable)
            .values({
                name: createUserDto.name,
                email: createUserDto.email,
                surname: createUserDto.surname,
                avatarUrl: createUserDto.avatarUrl ?? createUserDto.avatarUrl,
            })
            .returning();

        if (!users || !users.length) {
            throw new HTTPException(HttpStatusCode.INTERNAL_SERVER_ERROR, {
                message: 'Internal server error...',
            });
        }

        user = {
            ...users[0],
            createdAt: users[0].createdAt.toISOString(),
        };
    } catch (error) {
        throw new HTTPException(HttpStatusCode.INTERNAL_SERVER_ERROR, {
            message: 'Internal server error...',
        });
    }

    return ctx.json(user, HttpStatusCode.OK);
};
