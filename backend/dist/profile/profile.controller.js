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
exports.ProfileController = void 0;
const common_1 = require("@nestjs/common");
const access_token_guard_1 = require("../auth/guards/access-token-guard");
const users_service_1 = require("../users/users.service");
let ProfileController = class ProfileController {
    constructor(usersServices) {
        this.usersServices = usersServices;
    }
    async getProfile(req) {
        return await this.usersServices.findOneNoPass({ _id: req.user._id });
    }
    async updatePassword(req, changePassBody) {
        if (req.user._id !== changePassBody.userId) {
            throw new common_1.ForbiddenException("Poti nodifica doar parola ta");
        }
        return await this.usersServices.updateOwnPassword(changePassBody.userId, changePassBody.password);
    }
};
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccesTokenGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "getProfile", null);
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccesTokenGuard),
    (0, common_1.Patch)("change-password"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ProfileController.prototype, "updatePassword", null);
ProfileController = __decorate([
    (0, common_1.Controller)("profile"),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], ProfileController);
exports.ProfileController = ProfileController;
//# sourceMappingURL=profile.controller.js.map