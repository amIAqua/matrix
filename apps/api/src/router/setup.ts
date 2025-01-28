import type { OpenAPIHono } from '@hono/zod-openapi';

import {
    createUserRoute,
    createUserHandler,
    getUserByIdRoute,
    getUserByIdHandler,
} from 'src/router/routes/user';
import {
    loginRoute,
    loginHandler,
    logoutRoute,
    logoutHandler,
    registerRoute,
    registerHandler,
} from 'src/router/routes/auth';

export const setupRoutes = (app: OpenAPIHono): any => {
    app.openapi(getUserByIdRoute, getUserByIdHandler);
    app.openapi(createUserRoute, createUserHandler);
    app.openapi(loginRoute, loginHandler);
    app.openapi(logoutRoute, logoutHandler);
    app.openapi(registerRoute, registerHandler);
};
