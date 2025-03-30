import { Context } from 'hono';
import { createRoute, OpenAPIHono, z as zod } from '@hono/zod-openapi';
import { EHttpStatusCode } from 'src/api/common/enums/statusCode/EStatusCode';
import { THandlerResponse } from 'src/api/common/response/types/THandlerResponse';

export const registrationRouteHandler = new OpenAPIHono();

export const route = createRoute({
    method: 'post',
    path: '/registration',
    tags: ['backoffice'],
    responses: {
        201: {
            description: 'Registers new client',
            content: {
                'application/json': {
                    schema: zod.object({
                        message: zod.string(),
                    }),
                },
            },
        },
    },
});

export const handler = async (
    ctx: Context,
): Promise<THandlerResponse<{ message: string }, EHttpStatusCode.CREATED>> => {
    return ctx.json({ message: 'hello' }, EHttpStatusCode.CREATED);
};

registrationRouteHandler.openapi(route, handler);
