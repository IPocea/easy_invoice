import { IPayload, IValidateStrategyResponse } from "../interface/payload.interface";
declare const AccessTokenStrategy_base: new (...args: any[]) => any;
export declare class AccessTokenStrategy extends AccessTokenStrategy_base {
    constructor();
    validate(payload: IPayload): Promise<IValidateStrategyResponse>;
}
export {};
