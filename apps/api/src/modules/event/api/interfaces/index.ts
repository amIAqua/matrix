import { TEvent } from 'src/modules/event/api/types';
import { CreateEventDto } from 'src/modules/event/api/dto/request';

export interface ICreateEventService {
    runProgram(userId: string, createEventDto: CreateEventDto): Promise<TEvent>;
}
