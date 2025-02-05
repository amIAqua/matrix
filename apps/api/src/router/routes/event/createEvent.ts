import { Context } from 'hono';
import { Effect } from 'effect';
import { HTTPException } from 'hono/http-exception';
import { createRoute } from '@hono/zod-openapi';
import {
    HttpStatusCode,
    THandlerResponse,
    THttpError,
} from 'src/router/common/response';
import {
    createEventSchema,
    eventSchema,
} from 'src/router/routes/event/validation';
import { TEvent } from 'src/modules/common/types/event/TEvent';
import { InternalServerError } from 'src/router/common/errors';
import { authMiddleware } from 'src/router/common/middlewares/auth';
import { CreateEventDto } from 'src/modules/event/api/dto/request/createEventDto';
import { ICreateEventService } from 'src/modules/event/api/interfaces/ICreateEventService';

export const createEventRoute = createRoute({
    method: 'post',
    path: '/event',
    middleware: authMiddleware(),
    tags: ['event'],
    request: {
        body: {
            content: {
                'application/json': {
                    schema: createEventSchema,
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Create new event',
            content: {
                'application/json': {
                    schema: eventSchema,
                },
            },
        },
    },
});

type Services = {
    createEventService: ICreateEventService;
};

export const createEventHandler = async (
    ctx: Context,
    services: Services,
): Promise<THandlerResponse<TEvent, HttpStatusCode.OK>> => {
    const createEventDto: CreateEventDto = await ctx.req.json();

    const getCurrentUserId = Effect.try({
        try: () => {
            return ctx.get('session').user.id as string;
        },
        catch: (error) =>
            new InternalServerError(
                HttpStatusCode.INTERNAL_SERVER_ERROR,
                `Error: createEventHandler.getCurrentUserId - ${error}`,
            ),
    });

    let event: TEvent;
    try {
        event = await services.createEventService.runProgram(
            Effect.runSync(getCurrentUserId),
            createEventDto,
        );
    } catch (error: any) {
        const errorBody: THttpError = JSON.parse(
            (error.message as string) || '{}',
        );

        throw new HTTPException(errorBody.statusCode, {
            message: errorBody.message,
        });
    }

    return ctx.json(event, HttpStatusCode.OK);
};
