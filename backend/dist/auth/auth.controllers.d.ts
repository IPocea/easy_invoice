import { AuthService } from "./auth.service";
import { ILoginResponse } from "./interface/login-response.interface";
import { IAuthTokens } from "./interface/token.interface";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(req: any): Promise<ILoginResponse>;
    logout(req: any): Promise<{
        message: string;
    }>;
    refreshTokens(req: any): Promise<IAuthTokens>;
    resetPassword(req: any, userId: string, password: {
        password: string;
    }): Promise<{
        message: string;
    } | number>;
}
