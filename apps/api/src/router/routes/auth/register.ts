import { Context } from 'hono';
import { sql } from 'drizzle-orm';
import { hash, genSalt } from 'bcrypt';
import { Effect, pipe } from 'effect';
import { db, usersTable } from 'src/db';
import { createRoute } from '@hono/zod-openapi';
import { HTTPException } from 'hono/http-exception';
import { TDbUser } from 'src/modules/common/types/user/TDbUser';
import { RegisterUserDto } from 'src/router/routes/auth/types/dto/request';
import {
    registerUserSchema,
    userRegisteredResponseSchema,
} from 'src/router/routes/auth/validation/register';
import {
    EntityExistsError,
    InternalServerError,
} from 'src/router/common/errors';
import {
    HttpStatusCode,
    THandlerResponse,
    THttpError,
} from 'src/router/common/response';

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
        },
    },
    responses: {
        201: {
            description: 'Create new user account',
            content: {
                'application/json': {
                    schema: userRegisteredResponseSchema,
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
): Promise<THandlerResponse<THandlerReturnType, HttpStatusCode.CREATED>> => {
    const registerDto: RegisterUserDto = await ctx.req.json();

    const checkUserWithSameEmailExists = Effect.tryPromise({
        try: async () => {
            const [userDbResponse] = await db
                .select()
                .from(usersTable)
                .where(sql`${usersTable.email} = ${registerDto.email}`);

            if (userDbResponse) {
                throw new EntityExistsError(
                    HttpStatusCode.CLIENT_ERROR,
                    `User with email "${registerDto.email}" already exists`,
                );
            }
        },
        catch: (error) => {
            if (error instanceof EntityExistsError) return error;

            return new InternalServerError(
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                `Error: registerHandler.checkUserWithSameEmailExists - ${error}`,
            );
        },
    });

    const hashPassword = Effect.tryPromise({
        try: async () => {
            // will be moved to FE
            const salt = await genSalt(10);
            return await hash(registerDto.passwordHash, salt);
        },
        catch: (error) =>
            new InternalServerError(
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                `Error: registerHandler.hashPassword - ${error}`,
            ),
    });

    const createdUserDbResponse = (hashedPassword: string) =>
        Effect.tryPromise({
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
                        hashedPassword,
                    })
                    .returning();

                return userDbResponse as TDbUser;
            },
            catch: (error) => {
                return new InternalServerError(
                    HttpStatusCode.INTERNAL_SERVER_ERROR,
                    `Error: registerHandler.createdUserDbResponse - ${error}`,
                );
            },
        });

    const program = pipe(
        checkUserWithSameEmailExists,
        Effect.andThen(hashPassword),
        Effect.andThen((hashedPassword) =>
            createdUserDbResponse(hashedPassword),
        ),
    );

    let created = false;
    let userId;
    try {
        const { id } = await Effect.runPromise(program);

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

    return ctx.json({ created, userId }, HttpStatusCode.CREATED);
};
