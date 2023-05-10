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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const mail_service_1 = require("../mail/mail.service");
const check_admin_role_1 = require("../users/helpers/check-admin-role");
const auth_service_1 = require("./auth.service");
const access_token_guard_1 = require("./guards/access-token-guard");
const local_auth_guard_1 = require("./guards/local-auth.guard");
const refresh_token_guard_1 = require("./guards/refresh-token.guard");
const reset_token_guard_1 = require("./guards/reset-token-guard");
let AuthController = class AuthController {
    constructor(authService, mailService) {
        this.authService = authService;
        this.mailService = mailService;
    }
    async login(req) {
        return this.authService.login(req.user);
    }
    async logout(req) {
        return this.authService.logout(req.user);
    }
    async refreshTokens(req) {
        const userId = req.user["sub"];
        const refreshToken = req.user["refreshToken"];
        return this.authService.refreshToken(userId, refreshToken);
    }
    async resetPasswordByAdmin(req, userId, password) {
        try {
            (0, check_admin_role_1.checkAdminRole)(req.user["role"]);
            const result = await this.authService.changePassword(userId, password.password, req.user["role"]);
            if (result === 1) {
                throw new common_1.NotAcceptableException("Noua parola nu poate fi identica cu vechea parola");
            }
            return result;
        }
        catch (error) {
            throw error;
        }
    }
    async resetTokenPassword(email, headers) {
        try {
            const userAndToken = await this.authService.getResetPasswordToken(email.email);
            if (!userAndToken) {
                throw new common_1.NotFoundException(`There is no user with the email ${email.email}`);
            }
            await this.mailService.sendResetPasswordLink(userAndToken.user, userAndToken.token, headers.origin);
            return {
                message: "The email with the reset password link was sent. Please check your inbox.",
            };
        }
        catch (error) {
            throw error;
        }
    }
    async checkResetToken(req) {
        return { message: "Access allowed" };
    }
    async resetPassword(req, password) {
        try {
            const userId = req.user._id;
            const result = await this.authService.changePassword(userId, password.password, 'email');
            if (result === 1) {
                throw new common_1.NotAcceptableException("The new password cannot be the same as the old password");
            }
            return result;
        }
        catch (error) {
            throw error;
        }
    }
};
__decorate([
    (0, common_1.UseGuards)(local_auth_guard_1.LocalAuthGuard),
    (0, common_1.Post)("login"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccesTokenGuard),
    (0, common_1.Get)("logout"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
__decorate([
    (0, common_1.UseGuards)(refresh_token_guard_1.RefreshTokenGuard),
    (0, common_1.Get)("refresh"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshTokens", null);
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccesTokenGuard),
    (0, common_1.Post)("change-password/:id"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPasswordByAdmin", null);
__decorate([
    (0, common_1.Post)("reset-token-password"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Headers)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetTokenPassword", null);
__decorate([
    (0, common_1.UseGuards)(reset_token_guard_1.ResetTokenGuard),
    (0, common_1.Get)("reset-token-password"),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "checkResetToken", null);
__decorate([
    (0, common_1.UseGuards)(reset_token_guard_1.ResetTokenGuard),
    (0, common_1.Post)("reset-password"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
AuthController = __decorate([
    (0, common_1.Controller)("auth"),
    __metadata("design:paramtypes", [auth_service_1.AuthService,
        mail_service_1.MailService])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map