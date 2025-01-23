import { TypedResponse } from 'hono';
import { ContentfulStatusCode, StatusCode } from 'hono/utils/http-status';

export type THandlerResponse<T, S extends ContentfulStatusCode> = TypedResponse<
    T,
    S,
    'json'
>;

export enum HttpStatusCode {
    OK = 200,
    CREATED = 201,
}
