import { HttpStatusCode } from 'src/router/common/response';

export class InternalServerError {
    readonly _tag = 'InternalServerError';
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
