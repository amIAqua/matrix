import { Context } from 'hono';
import { z as zod } from 'zod';
import { createRoute } from '@hono/zod-openapi';
import { HttpStatusCode, THandlerResponse } from 'src/router/common/response';

export const getHelloRoute = createRoute({
    method: 'get',
    path: '/hello',
    responses: {
        200: {
            description: 'Respond a message',
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

export const getHelloHandler = (
    ctx: Context,
): THandlerResponse<{ message: string }, 200> => {
    return ctx.json(
        {
            message: 'hello route',
        },
        HttpStatusCode.OK,
    );
};
