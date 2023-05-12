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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const bcrypt = require("bcrypt");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const token_service_1 = require("../token/token.service");
const constants_1 = require("./constants");
let AuthService = class AuthService {
    constructor(usersService, jwtService, tokenService) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.tokenService = tokenService;
    }
    async validateUser(username, password) {
        const user = await this.usersService.findOne({
            username: {
                $regex: new RegExp("^" + username.toLowerCase() + "$", "i"),
            },
        });
        if (!user)
            return null;
        const passwordValid = await bcrypt.compare(password, user.password);
        if (user && passwordValid) {
            const userObject = user.toObject();
            delete userObject.password;
            return userObject;
        }
        return null;
    }
    async validateResetToken(payload) {
        var _a;
        const resetPasswordToken = (_a = (await this.tokenService.findOne({ userId: payload.sub }))) === null || _a === void 0 ? void 0 : _a.resetPasswordToken;
        if (!resetPasswordToken) {
            return null;
        }
        return resetPasswordToken;
    }
    async login(user) {
        const tokens = await this.getTokens(user._id, user.username, user.email, user.role, user.firstName, user.lastName);
        const isTokenInDatabase = await this.tokenService.findOne({
            userId: user._id,
        });
        if (!isTokenInDatabase) {
            const hashedRefreshToken = this.hasData(tokens.refreshToken);
            await this.tokenService.create({
                userId: user._id,
                refreshToken: hashedRefreshToken,
            });
        }
        else {
            await this.updateRefreshTokens(user._id, tokens.refreshToken);
        }
        return tokens;
    }
    async logout(user) {
        await this.tokenService.update(user._id, null, "refresh");
        return { message: "Ai fost delogat cu succes" };
    }
    hasData(data, salt = 8) {
        return bcrypt.hashSync(data, salt);
    }
    async refreshToken(userId, refreshToken) {
        var _a;
        const user = await this.usersService.findOne({ _id: userId });
        const userRefreshToken = (_a = (await this.tokenService.findOne({ userId: userId }))) === null || _a === void 0 ? void 0 : _a.refreshToken;
        if (!user || !userRefreshToken) {
            throw new common_1.HttpException({
                status: 498,
                error: "Acces interzis",
            }, 498);
        }
        const refreshTokenMatches = await bcrypt.compare(refreshToken, userRefreshToken);
        if (!refreshTokenMatches)
            throw new common_1.HttpException({
                status: 498,
                error: "Acces interzis",
            }, 498);
        const tokens = await this.getTokens(user._id, user.username, user.email, user.role, user.firstName, user.lastName);
        await this.updateRefreshTokens(user._id, tokens.refreshToken);
        return tokens;
    }
    async getResetPasswordToken(email) {
        const user = await this.usersService.findOne({
            email: {
                $regex: new RegExp("^" + email.toLowerCase() + "$", "i"),
            },
        });
        if (!user) {
            return null;
        }
        const token = await this.getResetToken(user._id, user.email);
        const isTokenInDatabase = await this.tokenService.findOne({
            userId: user._id,
        });
        if (!isTokenInDatabase) {
            await this.tokenService.create({
                userId: user._id,
                resetPasswordToken: token,
            });
        }
        else {
            await this.updateResetToken(user._id, token);
        }
        return { user: user, token: token };
    }
    async changePassword(userId, password, changedBy) {
        try {
            const isNewPasswordTheSame = await this.checkOldPassword(userId, password);
            if (isNewPasswordTheSame) {
                return 1;
            }
            else {
                const newPassword = bcrypt.hashSync(password, 8);
                await this.usersService.update(userId, { password: newPassword });
                if (changedBy === "email") {
                    await this.destroyResetPasswordToken(userId);
                }
                return { message: "Parola a fost schimbata cu succes" };
            }
        }
        catch (error) {
            return error;
        }
    }
    async updateRefreshTokens(userId, refreshToken) {
        const hashedRefreshToken = this.hasData(refreshToken);
        await this.tokenService.update(userId, hashedRefreshToken, "refresh");
    }
    async updateResetToken(userId, resetToken) {
        const hashedResetToken = this.hasData(resetToken);
        await this.tokenService.update(userId, hashedResetToken, "reset");
    }
    async destroyResetPasswordToken(userId) {
        await this.tokenService.update(userId, null, "reset");
        return { message: "The reset password token has been destroyed" };
    }
    async checkOldPassword(userId, password) {
        try {
            const oldPassword = await this.usersService.findUserPassword({
                _id: userId,
            });
            const passwordValid = bcrypt.compareSync(password, oldPassword);
            return passwordValid;
        }
        catch (error) {
            return null;
        }
    }
    async getTokens(userId, username, email, role, firstName, lastName) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync({
                sub: userId,
                username,
                email,
                role,
                firstName,
                lastName,
            }, {
                secret: constants_1.jwtConstants.accessTokenSecret,
                expiresIn: constants_1.jwtConstants.accessTokenExpirationTime,
            }),
            this.jwtService.signAsync({
                sub: userId,
                username,
                email,
                role,
                firstName,
                lastName,
            }, {
                secret: constants_1.jwtConstants.refreshTokenSecret,
                expiresIn: constants_1.jwtConstants.refreshTokenExpirationTime,
            }),
        ]);
        return {
            accessToken,
            refreshToken,
        };
    }
    async getResetToken(userId, email) {
        const resetToken = await this.jwtService.signAsync({
            sub: userId,
            email,
        }, {
            secret: constants_1.jwtConstants.resetTokenSecret,
            expiresIn: `${constants_1.jwtConstants.resetTokenExpirationTime}`,
        });
        return resetToken;
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        token_service_1.TokenService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map