import { TEvent } from 'src/modules/common/types/event/TEvent';
import { CreateEventDto } from 'src/modules/event/api/dto/request/createEventDto';

export interface ICreateEventService {
    runProgram(userId: string, createEventDto: CreateEventDto): Promise<TEvent>;
}
