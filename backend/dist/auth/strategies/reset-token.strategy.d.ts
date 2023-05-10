import { IPayload, IValidateStrategyResponse } from '../interface/payload.interface';
import { AuthService } from '../auth.service';
declare const ResetTokenStrategy_base: new (...args: any[]) => any;
export declare class ResetTokenStrategy extends ResetTokenStrategy_base {
    private authService;
    constructor(authService: AuthService);
    validate(payload: IPayload): Promise<IValidateStrategyResponse>;
}
export {};
