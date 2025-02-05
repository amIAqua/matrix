import { TUser } from 'src/modules/common/types/user/TUser';

export interface IUserGetByIdService {
    runProgram(userId: string): Promise<TUser>;
}
