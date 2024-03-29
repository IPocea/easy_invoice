"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConstantsService = void 0;
const config_1 = require("@nestjs/config");
const common_1 = require("@nestjs/common");
let ConstantsService = class ConstantsService {
    constructor(configService) {
        this.configService = configService;
        this.mongoDB = this.configService.get("mongoDB");
        this.accessTokenSecret =
            this.configService.get("accessTokenSecret");
        this.refreshTokenSecret =
            this.configService.get("refreshTokenSecret");
        this.resetTokenSecret = this.configService.get("resetTokenSecret");
        this.accessTokenExpirationTime = this.configService.get("accessTokenExpirationTime");
        this.refreshTokenExpirationTime = this.configService.get("refreshTokenExpirationTime");
        this.resetTokenExpirationTime = this.configService.get("resetTokenExpirationTime");
    }
    getMongoDbAddress() {
        return this.mongoDB;
    }
    getTokensSecrets() {
        return {
            accessTokenSecret: this.accessTokenSecret,
            refreshTokenSecret: this.refreshTokenSecret,
            resetTokenSecret: this.resetTokenSecret
        };
    }
    getTokensExpirationTime() {
        return {
            accessTokenExpirationTime: this.accessTokenExpirationTime,
            refreshTokenExpirationTime: this.refreshTokenExpirationTime,
            resetTokenExpirationTime: this.resetTokenExpirationTime,
        };
    }
};
ConstantsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ConstantsService);
exports.ConstantsService = ConstantsService;
//# sourceMappingURL=constants.service.js.map