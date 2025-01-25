import type { OpenAPIHono } from '@hono/zod-openapi';

import {
    createUserRoute,
    createUserHandler,
    getUserByIdRoute,
    getUserByIdHandler,
} from 'src/router/routes/user';

export const setupRoutes = (app: OpenAPIHono): any => {
    app.openapi(getUserByIdRoute, getUserByIdHandler);
    app.openapi(createUserRoute, createUserHandler);
};
