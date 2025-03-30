import { OpenAPIHono } from '@hono/zod-openapi';
import { registrationRouteHandler } from 'src/api/backoffice/registration/handlers';

export const setupRoutes = (app: OpenAPIHono): void => {
    app.route('/backoffice', registrationRouteHandler);
};
