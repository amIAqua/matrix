import { serve } from '@hono/node-server';
import { OpenAPIHono } from '@hono/zod-openapi';

import { setupRoutes } from 'src/router/setup';
import { setupSwagger } from 'src/swagger/setup';

import 'dotenv/config';
import { cors } from 'hono/cors';

const app = new OpenAPIHono();
app.use(
    cors({
        origin: 'localhost',
        allowMethods: ['GET', 'POST'],
    }),
);

setupSwagger(app);
setupRoutes(app);

const envPort = process.env.PORT;
const appPort = envPort ? parseInt(envPort) : 3000;

serve({
    fetch: app.fetch,
    port: appPort,
});
