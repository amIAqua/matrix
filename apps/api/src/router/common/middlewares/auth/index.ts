import { verify } from 'hono/jwt';
import { getCookie } from 'hono/cookie';
import { MiddlewareHandler } from 'hono';
import { appConfig } from 'src/app/config';
import { createMiddleware } from 'hono/factory';
import { JWTPayload } from 'hono/utils/jwt/types';
import { HTTPException } from 'hono/http-exception';
import { TUser } from 'src/router/common/types/user';
import { HttpStatusCode } from 'src/router/common/response';

export const authMiddleware = (): MiddlewareHandler => {
    const middleware = createMiddleware(async (ctx, next) => {
        const authToken = getCookie(ctx, appConfig.SESSION_COOKIE_NAME);

        if (!authToken) {
            throw new HTTPException(HttpStatusCode.UNAUTHORIZED, {
                message: 'Unauthorized access',
            });
        }

        let payload: JWTPayload;
        try {
            payload = await verify(authToken, appConfig.ENCRYPTION_SESSION_KEY);
        } catch (error) {
            console.log(error);
            throw new HTTPException(HttpStatusCode.INTERNAL_SERVER_ERROR, {
                message:
                    'Error while verifying auth token. Token is incorrect or session expired...',
            });
        }

        if (payload) {
            ctx.set('session', {
                expiresInAt: payload.exp,
                loggedInAt: payload.loggedInAt,
                user: payload.user as TUser,
            });
        }

        await next();
    });

    return middleware;
};
