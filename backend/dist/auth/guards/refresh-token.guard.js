"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const jwt = require("jsonwebtoken");
let RefreshTokenGuard = class RefreshTokenGuard extends (0, passport_1.AuthGuard)("jwt-refresh") {
    handleRequest(err, user, info) {
        if (info instanceof jwt.TokenExpiredError) {
            throw new common_1.HttpException({
                status: 498,
                error: "Tokenul refresh a expirat",
            }, 498);
        }
        if (err || !user) {
            throw new common_1.HttpException({
                status: 498,
                error: "Acces interzis",
            }, 498);
        }
        return user;
    }
};
RefreshTokenGuard = __decorate([
    (0, common_1.Injectable)()
], RefreshTokenGuard);
exports.RefreshTokenGuard = RefreshTokenGuard;
//# sourceMappingURL=refresh-token.guard.js.map