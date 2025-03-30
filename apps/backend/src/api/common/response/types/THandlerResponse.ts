import { TypedResponse } from 'hono';
import { EHttpStatusCode } from 'src/api/common/enums/statusCode/EStatusCode';

export type THandlerResponse<T, S extends EHttpStatusCode> = TypedResponse<
    T,
    S,
    'json'
>;
