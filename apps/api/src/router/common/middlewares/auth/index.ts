import { verify } from 'hono/jwt';
import { Effect, pipe } from 'effect';
import { getCookie } from 'hono/cookie';
import { MiddlewareHandler } from 'hono';
import { appConfig } from 'src/app/config';
import { createMiddleware } from 'hono/factory';
import { HTTPException } from 'hono/http-exception';
import { TUser } from 'src/router/common/types/user';
import { HttpStatusCode, THttpError } from 'src/router/common/response';
import {
    InternalServerError,
    UnauthorizedError,
} from 'src/router/common/errors';

export const authMiddleware = (): MiddlewareHandler => {
    const middleware = createMiddleware(async (ctx, next) => {
        const getAuthTokenFromCookie = Effect.try({
            try: () => {
                const tokenFromCookie = getCookie(
                    ctx,
                    appConfig.SESSION_COOKIE_NAME,
                );

                if (!tokenFromCookie) {
                    throw new UnauthorizedError(
                        HttpStatusCode.UNAUTHORIZED,
                        'Unauthorized access.',
                    );
                }

                return tokenFromCookie;
            },
            catch: () => {
                return new UnauthorizedError(
                    HttpStatusCode.UNAUTHORIZED,
                    'Unauthorized access',
                );
            },
        });

        const verifyAuthToken = (authToken: string) =>
            Effect.tryPromise({
                try: async () => {
                    return await verify(
                        authToken,
                        appConfig.ENCRYPTION_SESSION_KEY,
                    );
                },
                catch: () =>
                    new InternalServerError(
                        HttpStatusCode.INTERNAL_SERVER_ERROR,
                        'Error while verifying auth token. Token is incorrect or session expired',
                    ),
            });

        const setSession = (payload: any) =>
            Effect.try(() => {
                ctx.set('session', {
                    expiresInAt: payload.exp,
                    loggedInAt: payload.loggedInAt,
                    user: payload.user as TUser,
                });
            });

        const effect = pipe(
            getAuthTokenFromCookie,
            Effect.flatMap((authToken) => verifyAuthToken(authToken)),
            Effect.flatMap(setSession),
        );

        try {
            await Effect.runPromise(effect);
        } catch (error: any) {
            const errorBody: THttpError = JSON.parse(
                (error.message as string) || '{}',
            );

            throw new HTTPException(errorBody.statusCode, {
                message: errorBody.message,
            });
        }

        await next();
    });

    return middleware;
};
