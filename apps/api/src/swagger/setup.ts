import type { OpenAPIHono } from '@hono/zod-openapi';
import { swaggerUI } from '@hono/swagger-ui';

export const setupSwagger = (app: OpenAPIHono) => {
    app.get(
        '/ui',
        swaggerUI({
            url: '/doc',
        }),
    );

    app.doc('/doc', {
        info: {
            title: 'An API',
            version: 'v1',
        },
        openapi: '3.1.0',
    });
};
