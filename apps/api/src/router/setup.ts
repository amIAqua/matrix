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
import { createEventRoute, createEventHandler } from 'src/router/routes/event';
import { CreateEventService } from 'src/modules/event/services';

export const setupRoutes = (app: OpenAPIHono): void => {
    const createEventService = new CreateEventService();

    app.openapi(getUserByIdRoute, getUserByIdHandler);
    app.openapi(createUserRoute, createUserHandler);
    app.openapi(loginRoute, loginHandler);
    app.openapi(logoutRoute, logoutHandler);
    app.openapi(registerRoute, registerHandler);
    app.openapi(createEventRoute, (ctx) =>
        createEventHandler(ctx, {
            createEventService,
        }),
    );
};
