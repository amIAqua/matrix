import { Context } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { createRoute } from '@hono/zod-openapi';
import {
    HttpStatusCode,
    THandlerResponse,
    THttpError,
} from 'src/router/common/response';
import { TUser } from 'src/modules/common/types/user/TUser';
import {
    userSchema,
    getUserByIdParams,
} from 'src/router/routes/user/validation';
import { authMiddleware } from 'src/router/common/middlewares/auth';
import { IUserGetByIdService } from 'src/modules/user/api/interfaces/IUserGetByIdService';

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

type Services = {
    userGetByIdService: IUserGetByIdService;
};

export const getUserByIdHandler = async (
    ctx: Context,
    services: Services,
): Promise<THandlerResponse<TUser, HttpStatusCode.OK>> => {
    const userId: string = ctx.req.param('id');

    let user: TUser;
    try {
        user = await services.userGetByIdService.runProgram(userId);
    } catch (error: any) {
        const errorBody: THttpError = JSON.parse(
            (error.message as string) || '{}',
        );

        throw new HTTPException(errorBody.statusCode, {
            message: errorBody.message,
        });
    }

    return ctx.json(user, HttpStatusCode.OK);
};
