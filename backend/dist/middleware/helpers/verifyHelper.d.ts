import { UsersService } from "../../users/users.service";
export declare class VerifyHelper {
    private readonly userService;
    ROLES: string[];
    emailPattern: RegExp;
    passwordPattern: RegExp;
    constructor(userService: UsersService);
    checkEmptyInputs(...args: string[]): void;
    checkRole(role: string): string;
    checkPasswordPattern(password: string): void;
    checkEmailPattern(email: string): void;
    checkDuplicateEmail(email: string): Promise<void>;
}
