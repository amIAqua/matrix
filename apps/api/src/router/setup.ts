import type { OpenAPIHono } from '@hono/zod-openapi';

import { getHelloRoute, getHelloHandler } from 'src/router/routes/hello';

export const setupRoutes = (app: OpenAPIHono): any => {
    app.openapi(getHelloRoute, getHelloHandler);
};
