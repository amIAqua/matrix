import { serve } from '@hono/node-server';
import { db } from 'src/db';
import { OpenAPIHono } from '@hono/zod-openapi';
import { sessionMiddleware } from 'src/router/common/middlewares/session';

import { setupRoutes } from 'src/router/setup';
import { setupSwagger } from 'src/swagger/setup';

import 'dotenv/config';
import { cors } from 'hono/cors';
import { appConfig } from './app/config';

const app = new OpenAPIHono();
app.use(
    cors({
        origin: 'localhost',
        allowMethods: ['GET', 'POST'],
    }),
);

app.use(
    '*',
    sessionMiddleware({
        sessionCookieName: 'auth-token',
        encryptionKey: 'super-secret-key',
        store: {
            db,
        },
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
