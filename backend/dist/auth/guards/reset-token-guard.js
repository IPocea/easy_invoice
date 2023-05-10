"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResetTokenGuard = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const jwt = require("jsonwebtoken");
let ResetTokenGuard = class ResetTokenGuard extends (0, passport_1.AuthGuard)('jwt-reset') {
    handleRequest(err, user, info) {
        if (info instanceof jwt.TokenExpiredError) {
            throw new common_1.ForbiddenException('Tokenul de resetare al parolei a expirat');
        }
        if (err || !user) {
            throw err || new common_1.UnauthorizedException('Acces Interzis');
        }
        return user;
    }
};
ResetTokenGuard = __decorate([
    (0, common_1.Injectable)()
], ResetTokenGuard);
exports.ResetTokenGuard = ResetTokenGuard;
//# sourceMappingURL=reset-token-guard.js.map