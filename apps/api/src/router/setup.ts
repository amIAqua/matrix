import type { OpenAPIHono } from '@hono/zod-openapi';

import {
    createUserRoute,
    createUserHandler,
    getUserByIdRoute,
    getUserByIdHandler,
} from 'src/router/routes/user';
import { loginRoute, loginHandler } from 'src/router/routes/auth';

export const setupRoutes = (app: OpenAPIHono): any => {
    app.openapi(getUserByIdRoute, getUserByIdHandler);
    app.openapi(createUserRoute, createUserHandler);
    app.openapi(loginRoute, loginHandler);
};
