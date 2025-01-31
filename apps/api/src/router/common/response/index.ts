import { TypedResponse } from 'hono';

export type THandlerResponse<T, S extends HttpStatusCode> = TypedResponse<
    T,
    S,
    'json'
>;

export type THttpError = {
    statusCode: HttpStatusCode;
    message: string;
};

export enum HttpStatusCode {
    OK = 200,
    CREATED = 201,
    INTERNAL_SERVER_ERROR = 500,
    CLIENT_ERROR = 400,
    NOT_FOUND = 404,
    UNAUTHORIZED = 403,
    UNPROCESSABLE_ENTITY = 422,
}
