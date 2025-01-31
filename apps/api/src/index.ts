import { serve } from '@hono/node-server';
import { OpenAPIHono } from '@hono/zod-openapi';

import { setupRoutes } from 'src/router/setup';
import { setupSwagger } from 'src/swagger/setup';

import { cors } from 'hono/cors';
import { appConfig } from 'src/app/config';
import { defaultHook } from 'src/router/common/errors';

const app = new OpenAPIHono({
    defaultHook,
});

app.use(
    cors({
        origin: 'localhost',
        allowMethods: ['GET', 'POST'],
    }),
);

setupSwagger(app);
setupRoutes(app);

const envPort = appConfig.PORT;
const port = envPort ? parseInt(envPort) : 3000;

serve({
    fetch: app.fetch,
    port,
});
