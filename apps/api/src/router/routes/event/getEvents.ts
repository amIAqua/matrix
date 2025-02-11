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
    eventsFilterSchema,
    getEventsResponseSchema,
} from 'src/router/routes/event/validation';
import { TEvent } from 'src/modules/common/types/event/TEvent';
import { authMiddleware } from 'src/router/common/middlewares/auth';
import { IGetEventsService } from 'src/modules/event/api/interfaces/IGetEventsService';
import { EventsFilterDto } from 'src/modules/event/api/dto/request/eventsFilterDto';

export const getEventsRoute = createRoute({
    method: 'get',
    path: '/events',
    // middleware: authMiddleware(),
    tags: ['event'],
    request: {
        // query: {
        //     // content: {
        //     //     'application/json': {
        //     //         schema: eventsFilterSchema,
        //     //     },
        //     // },
        // },
    },
    responses: {
        200: {
            description: 'Get events by filter',
            content: {
                'application/json': {
                    schema: getEventsResponseSchema,
                },
            },
        },
    },
});

type Services = {
    getEventsService: IGetEventsService;
};

export const getEventsHandler = async (
    ctx: Context,
    services: Services,
): Promise<THandlerResponse<{ data: TEvent[] }, HttpStatusCode.OK>> => {
    // const eventsFilter: EventsFilterDto = await ctx.req.json();

    let events: TEvent[] = [];
    try {
        events = await services.getEventsService.runProgram({});
    } catch (error: any) {
        const errorBody: THttpError = JSON.parse(
            (error.message as string) || '{}',
        );

        throw new HTTPException(errorBody.statusCode, {
            message: errorBody.message,
        });
    }

    return ctx.json(
        {
            data: events,
        },
        HttpStatusCode.OK,
    );
};
