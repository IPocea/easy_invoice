export interface IPayload {
    username: string;
    sub: string;
    role?: string;
    firstName?: string;
    lastName?: string;
    iat?: number;
    exp?: number;
}
export interface IValidateStrategyResponse {
    _id: string;
    username: string;
    role?: string;
    firstName?: string;
    lastName?: string;
    refreshToken?: string;
}
