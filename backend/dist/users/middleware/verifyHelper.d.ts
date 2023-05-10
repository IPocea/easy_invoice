import { UsersService } from "../users.service";
export declare class VerifyHelper {
    private readonly userService;
    constructor(userService: UsersService);
    checkDuplicateEmail(email: string): Promise<void>;
    checkDuplicateUser(username: string): Promise<void>;
}
