import { MailService } from "src/mail/mail.service";
import { AuthService } from "./auth.service";
import { ILoginResponse } from "./interface/login-response.interface";
import { IAuthTokens } from "./interface/token.interface";
export declare class AuthController {
    private readonly authService;
    private readonly mailService;
    constructor(authService: AuthService, mailService: MailService);
    login(req: any): Promise<ILoginResponse>;
    logout(req: any): Promise<{
        message: string;
    }>;
    refreshTokens(req: any): Promise<IAuthTokens>;
    resetPasswordByAdmin(req: any, userId: string, password: {
        password: string;
    }): Promise<{
        message: string;
    } | number>;
    resetTokenPassword(email: any, headers: any): Promise<{
        message: string;
    }>;
    checkResetToken(req: any): Promise<{
        message: string;
    }>;
    resetPassword(req: any, password: any): Promise<{
        message: string;
    } | number>;
}
