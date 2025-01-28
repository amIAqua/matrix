import { Context } from 'hono';
import { Effect } from 'effect';
import { db, usersTable } from 'src/db';
import { HTTPException } from 'hono/http-exception';
import { createRoute, z as zod } from '@hono/zod-openapi';
import { RegisterUserDto } from 'src/router/routes/auth/types';
import { registerUserSchema } from 'src/router/routes/auth/validation';
import { InternalServerError } from 'src/router/common/errors';
import {
    HttpStatusCode,
    THandlerResponse,
    THttpError,
} from 'src/router/common/response';
import { TDbUser } from 'src/router/common/types/user';

export const registerRoute = createRoute({
    method: 'post',
    path: 'auth/register',
    tags: ['auth'],
    request: {
        body: {
            content: {
                'application/json': {
                    schema: registerUserSchema,
                },
            },
            required: true,
        },
    },
    responses: {
        200: {
            description: 'Create new user account',
            content: {
                'application/json': {
                    schema: zod.object({
                        created: zod.boolean(),
                        userId: zod.string(),
                    }),
                },
            },
        },
    },
});

type THandlerReturnType = {
    created: boolean;
    userId: string;
};

export const registerHandler = async (
    ctx: Context,
): Promise<THandlerResponse<THandlerReturnType, HttpStatusCode.OK>> => {
    const registerDto: RegisterUserDto = await ctx.req.json();

    const createdUserDbResponse = Effect.tryPromise({
        try: async () => {
            const [userDbResponse] = await db
                .insert(usersTable)
                .values({
                    name: registerDto.name,
                    surname: registerDto.surname,
                    email: registerDto.email,
                    avatarUrl: registerDto.avatarUrl
                        ? registerDto.avatarUrl
                        : null,
                    hashedPassword: registerDto.hashedPassword,
                })
                .returning();

            return userDbResponse as TDbUser;
        },
        catch: () => {
            return new InternalServerError(
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                'Internal server error...Please, try again later',
            );
        },
    });

    let created = false;
    let userId;
    try {
        const { id } = await Effect.runPromise(createdUserDbResponse);

        userId = id!;
        created = true;
    } catch (error: any) {
        const errorBody: THttpError = JSON.parse(
            (error.message as string) || '{}',
        );

        throw new HTTPException(errorBody.statusCode, {
            message: errorBody.message,
        });
    }

    return ctx.json({ created, userId }, HttpStatusCode.OK);
};
