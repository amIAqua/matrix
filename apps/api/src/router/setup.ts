import type { OpenAPIHono } from '@hono/zod-openapi';

import { getUserByIdRoute, getUserByIdHandler } from 'src/router/routes/user';
import {
    loginRoute,
    loginHandler,
    logoutRoute,
    logoutHandler,
    registerRoute,
    registerHandler,
} from 'src/router/routes/auth';
import {
    createEventRoute,
    createEventHandler,
    getEventsRoute,
    getEventsHandler,
} from 'src/router/routes/event';
import {
    CreateEventService,
    GetEventsService,
} from 'src/modules/event/services';
import { UserGetByIdService } from 'src/modules/user/services';

export const setupRoutes = (app: OpenAPIHono): void => {
    const createEventService = new CreateEventService();
    const getEventsService = new GetEventsService();
    const userGetByIdService = new UserGetByIdService();

    app.openapi(getUserByIdRoute, (ctx) =>
        getUserByIdHandler(ctx, {
            userGetByIdService,
        }),
    );

    app.openapi(loginRoute, loginHandler);
    app.openapi(logoutRoute, logoutHandler);
    app.openapi(registerRoute, registerHandler);
    app.openapi(createEventRoute, (ctx) =>
        createEventHandler(ctx, {
            createEventService,
        }),
    );
    app.openapi(getEventsRoute, (ctx) =>
        getEventsHandler(ctx, {
            getEventsService,
        }),
    );
};
