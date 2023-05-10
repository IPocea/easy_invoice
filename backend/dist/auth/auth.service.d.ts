import { IUser } from "../users/interface/user.interface";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "../users/users.service";
import { TokenService } from "../token/token.service";
import { IAuthTokens } from "./interface/token.interface";
import { IPayload } from "./interface/payload.interface";
export declare class AuthService {
    private readonly usersService;
    private jwtService;
    private tokenService;
    constructor(usersService: UsersService, jwtService: JwtService, tokenService: TokenService);
    validateUser(username: string, password: string): Promise<IUser>;
    validateResetToken(payload: IPayload): Promise<string>;
    login(user: IUser): Promise<IAuthTokens>;
    logout(user: IUser): Promise<{
        message: string;
    }>;
    hasData(data: string, salt?: number): string;
    refreshToken(userId: string, refreshToken: string): Promise<IAuthTokens>;
    getResetPasswordToken(email: string): Promise<{
        user: IUser;
        token: string;
    }>;
    changePassword(userId: string, password: string, changedBy: string): Promise<{
        message: string;
    } | number>;
    updateRefreshTokens(userId: string, refreshToken: string): Promise<void>;
    updateResetToken(userId: string, resetToken: string): Promise<void>;
    destroyResetPasswordToken(userId: string): Promise<{
        message: string;
    }>;
    checkOldPassword(userId: string, password: string): Promise<boolean>;
    getTokens(userId: string, username: string, email: string, role: string, firstName: string, lastName: string): Promise<IAuthTokens>;
    getResetToken(userId: string, email: string): Promise<string>;
}
