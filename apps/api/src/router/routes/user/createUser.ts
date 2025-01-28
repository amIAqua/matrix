import { Context } from 'hono';
import { db, usersTable } from 'src/db';
import { HTTPException } from 'hono/http-exception';
import { createRoute } from '@hono/zod-openapi';
import { mapDbUserEntityToTUser } from 'src/router/common/mappers/user';
import { HttpStatusCode, THandlerResponse } from 'src/router/common/response';
import { TUser } from 'src/router/common/types/user';
import {
    userSchema,
    createUserSchema,
} from 'src/router/routes/user/validation';
import { CreateUserDto } from 'src/router/routes/user/types';
import { authMiddleware } from 'src/router/common/middlewares/auth';

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
    try {
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
            throw new HTTPException(HttpStatusCode.INTERNAL_SERVER_ERROR, {
                message: 'Internal server error...',
            });
        }

        user = mapDbUserEntityToTUser(userDbResponse);
    } catch (error) {
        throw new HTTPException(HttpStatusCode.INTERNAL_SERVER_ERROR, {
            message: 'Internal server error...',
        });
    }

    return ctx.json(user, HttpStatusCode.OK);
};
