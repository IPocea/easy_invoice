import { TokenDocument } from "../token/schemas/token.schema";
import { Model } from "mongoose";
import { CreateRefreshTokenDto } from "./dto/create-refresh-token.dto";
import { ITokens } from "./interface/tokens.interface";
export declare class TokenService {
    private tokenModel;
    constructor(tokenModel: Model<TokenDocument>);
    create(newRefreshToken: CreateRefreshTokenDto): Promise<ITokens>;
    update(userId: string, token: string | null, tokenType: string): Promise<ITokens>;
    findOne(query: object): Promise<ITokens>;
    findAll(): Promise<ITokens[]>;
}
