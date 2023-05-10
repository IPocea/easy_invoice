import { ITokens } from "./interface/tokens.interface";
import { TokenService } from "./token.service";
export declare class TokenController {
    private readonly tokenService;
    constructor(tokenService: TokenService);
    findAll(req: any): Promise<ITokens[]>;
}
