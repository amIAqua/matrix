import { TypedResponse } from 'hono';

export type THandlerResponse<T, S extends HttpStatusCode> = TypedResponse<
    T,
    S,
    'json'
>;

export enum HttpStatusCode {
    OK = 200,
    CREATED = 201,
    INTERNAL_SERVER_ERROR = 500,
    NOT_FOUND = 404,
}
