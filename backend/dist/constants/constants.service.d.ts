import { ConfigService } from "@nestjs/config";
export declare class ConstantsService {
    private readonly configService;
    private readonly mongoDB;
    private readonly accessTokenSecret;
    private readonly refreshTokenSecret;
    private readonly resetTokenSecret;
    private readonly accessTokenExpirationTime;
    private readonly refreshTokenExpirationTime;
    private readonly resetTokenExpirationTime;
    constructor(configService: ConfigService);
    getMongoDbAddress(): string;
    getTokensSecrets(): {
        accessTokenSecret: string;
        refreshTokenSecret: string;
        resetTokenSecret: string;
    };
    getTokensExpirationTime(): {
        accessTokenExpirationTime: string;
        refreshTokenExpirationTime: string;
        resetTokenExpirationTime: string;
    };
}
