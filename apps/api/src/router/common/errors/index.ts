import { ZodError } from 'zod';
import { Context, ValidationTargets } from 'hono';
import { HttpStatusCode } from 'src/router/common/response';

type ZodErrorResult =
    | ({
          target: keyof ValidationTargets;
      } & {
          success: false;
          error: ZodError;
      })
    | {
          success: true;
          data: Record<string, string>;
      };

export const defaultHook = (result: ZodErrorResult, ctx: Context) => {
    if (!result.success) {
        // @ts-ignore
        const errorData = result.data;
        return ctx.json(
            {
                type: 'Validation error',
                fields: Object.keys(errorData).join(', '),
                message: result.error.errors
                    .map((zodError) => `${zodError.path}: ${zodError.message}`)
                    .join(', '),
            },
            HttpStatusCode.UNPROCESSABLE_ENTITY,
        );
    }
};

export class InternalServerError {
    readonly _tag = 'InternalServerError';
    constructor(
        readonly statusCode: HttpStatusCode,
        readonly message: string,
    ) {}
}

export class ClientError {
    readonly _tag = 'ClientError';
    constructor(
        readonly statusCode: HttpStatusCode,
        readonly message: string,
    ) {}
}

export class NotFoundError {
    readonly _tag = 'NotFoundError';
    constructor(
        readonly statusCode: HttpStatusCode,
        readonly message: string,
    ) {}
}

export class UnauthorizedError {
    readonly _tag = 'UnauthorizedError';
    constructor(
        readonly statusCode: HttpStatusCode,
        readonly message: string,
    ) {}
}

export class EntityExistsError {
    readonly _tag = 'EntityExistsError';
    constructor(
        readonly statusCode: HttpStatusCode,
        readonly message: string,
    ) {}
}
