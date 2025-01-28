import { Context } from 'hono';
import { Effect } from 'effect';
import { deleteCookie } from 'hono/cookie';
import { appConfig } from 'src/app/config';
import { HTTPException } from 'hono/http-exception';
import { createRoute, z as zod } from '@hono/zod-openapi';
import { HttpStatusCode, THandlerResponse } from 'src/router/common/response';

export const logoutRoute = createRoute({
    method: 'get',
    path: 'auth/logout',
    tags: ['auth'],
    responses: {
        200: {
            description: 'Logout user and reset session',
            content: {
                'application/json': {
                    schema: zod.object({
                        loggedOut: zod.boolean(),
                    }),
                },
            },
        },
    },
});

export const logoutHandler = async (
    ctx: Context,
): Promise<THandlerResponse<{ loggedOut: boolean }, HttpStatusCode.OK>> => {
    const deleteSessionToken = Effect.try(() => {
        deleteCookie(ctx, appConfig.SESSION_COOKIE_NAME);

        return true;
    });

    let loggedOut = false;
    try {
        loggedOut = await Effect.runPromise(deleteSessionToken);
    } catch (error: any) {
        throw new HTTPException(HttpStatusCode.INTERNAL_SERVER_ERROR, {
            message: 'Logout failed. Please try again later',
        });
    }

    return ctx.json({ loggedOut }, HttpStatusCode.OK);
};
