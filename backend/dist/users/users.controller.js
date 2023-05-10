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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const access_token_guard_1 = require("../auth/guards/access-token-guard");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const users_service_1 = require("./users.service");
const check_admin_role_1 = require("./helpers/check-admin-role");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async findAll(req, query) {
        (0, check_admin_role_1.checkAdminRole)(req.user.role);
        return await this.usersService.findAll(query);
    }
    async findOne(req, userId) {
        (0, check_admin_role_1.checkAdminRole)(req.user.role);
        const user = await this.usersService.findOneNoPass({ _id: userId });
        if (!user)
            throw new common_1.NotFoundException(`Nu am putut gasi user-ul cu id-ul ${userId}`);
        return user;
    }
    async signup(req, query, user) {
        (0, check_admin_role_1.checkAdminRole)(req.user.role);
        try {
            return await this.usersService.create(user, query);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async updateOne(req, userId, query, body) {
        (0, check_admin_role_1.checkAdminRole)(req.user.role);
        if (body.hasOwnProperty("password"))
            throw new common_1.ForbiddenException();
        const result = await this.usersService.toogleUserStatus(userId, body, query);
        if (!result) {
            throw new common_1.NotFoundException(`Nu pot gasi user-ul cu id-ul ${userId}`);
        }
        return result;
    }
    async updateUser(req, userId, query, body) {
        (0, check_admin_role_1.checkAdminRole)(req.user.role);
        if (body.hasOwnProperty("password"))
            throw new common_1.ForbiddenException();
        const result = await this.usersService.updateUser(userId, body, query);
        if (!result) {
            throw new common_1.NotFoundException(`Nu pot gasi user-ul cu id-ul ${userId}`);
        }
        return result;
    }
    async changePassword(req, userId, query, password) {
        (0, check_admin_role_1.checkAdminRole)(req.user.role);
        const result = await this.usersService.updatePassword(userId, password.password, query);
        if (!result) {
            throw new common_1.BadRequestException();
        }
        return result;
    }
    async deleteOne(req, userId, query) {
        (0, check_admin_role_1.checkAdminRole)(req.user.role);
        const result = await this.usersService.deleteOne(userId, query);
        if (!result)
            throw new common_1.NotFoundException(`Nu am putut sterge user-ul cu id-ul ${userId}. Poate ca userul nu exista`);
        return result;
    }
};
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccesTokenGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccesTokenGuard),
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccesTokenGuard),
    (0, common_1.Post)("add"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "signup", null);
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccesTokenGuard),
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateOne", null);
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccesTokenGuard),
    (0, common_1.Patch)(":id/edit-user"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateUser", null);
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccesTokenGuard),
    (0, common_1.Patch)(":id/change-password"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Query)()),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "changePassword", null);
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccesTokenGuard),
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "deleteOne", null);
UsersController = __decorate([
    (0, common_1.Controller)("users"),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map