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
exports.MyCompanyController = void 0;
const common_1 = require("@nestjs/common");
const access_token_guard_1 = require("../auth/guards/access-token-guard");
const create_my_company_dto_1 = require("./dto/create-my-company.dto");
const check_admin_role_1 = require("../users/helpers/check-admin-role");
const my_company_service_1 = require("./my-company.service");
const update_my_company_dto_1 = require("./dto/update-my-company.dto");
let MyCompanyController = class MyCompanyController {
    constructor(myCompanyService) {
        this.myCompanyService = myCompanyService;
    }
    async find() {
        return await this.myCompanyService.findAll();
    }
    async create(myCompanyDto, req) {
        (0, check_admin_role_1.checkAdminRole)(req.user["role"]);
        try {
            return await this.myCompanyService.create(myCompanyDto);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async update(companyId, companyUpdate) {
        const result = await this.myCompanyService.update(companyId, companyUpdate);
        if (!result) {
            throw new common_1.NotFoundException(`Nu pot gasi user-ul cu id-ul ${companyId}`);
        }
        return result;
    }
};
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccesTokenGuard),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MyCompanyController.prototype, "find", null);
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccesTokenGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_my_company_dto_1.CreateMyCompanyDto, Object]),
    __metadata("design:returntype", Promise)
], MyCompanyController.prototype, "create", null);
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccesTokenGuard),
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_my_company_dto_1.UpdateMyCompanyDto]),
    __metadata("design:returntype", Promise)
], MyCompanyController.prototype, "update", null);
MyCompanyController = __decorate([
    (0, common_1.Controller)("my-company"),
    __metadata("design:paramtypes", [my_company_service_1.MyCompanyService])
], MyCompanyController);
exports.MyCompanyController = MyCompanyController;
//# sourceMappingURL=my-company.controller.js.map