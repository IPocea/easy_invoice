import { IUser } from "src/users/interface/user.interface";
import { UsersService } from "../users/users.service";
import { IChangePasswordBody } from "./interface/profile.interface";
export declare class ProfileController {
    private readonly usersServices;
    constructor(usersServices: UsersService);
    getProfile(req: any): Promise<IUser>;
    updatePassword(req: any, changePassBody: IChangePasswordBody): Promise<{
        message: string;
    }>;
}
