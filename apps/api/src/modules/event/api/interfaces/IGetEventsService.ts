import { TEvent } from 'src/modules/common/types/event/TEvent';

export interface IGetEventsService {
    runProgram(filter: any): Promise<TEvent[]>;
}
