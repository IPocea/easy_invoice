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
exports.IndividualController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const access_token_guard_1 = require("../auth/guards/access-token-guard");
const check_admin_role_1 = require("../users/helpers/check-admin-role");
const dto_1 = require("./dto");
const individual_service_1 = require("./individual.service");
let IndividualController = class IndividualController {
    constructor(individualService) {
        this.individualService = individualService;
    }
    async findAll(query) {
        return await this.individualService.findAll(query);
    }
    async findAllActives(query) {
        return await this.individualService.findAllActives(query);
    }
    async findOne(individualId) {
        const ObjectId = mongoose_1.default.Types.ObjectId;
        const company = await this.individualService.findOne({
            _id: new ObjectId(`${individualId}`),
        });
        if (!company)
            throw new common_1.NotFoundException(`Nu am putut gasi persoana fizica cu id-ul ${individualId}`);
        return company;
    }
    async add(query, individual) {
        try {
            return await this.individualService.create(individual, query);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async addAndReturnIt(individual) {
        try {
            return await this.individualService.createAndReturnIt(individual);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async editIndividual(individualId, query, updateIndividualDto) {
        const result = await this.individualService.updateOne(individualId, updateIndividualDto, query);
        if (!result) {
            throw new common_1.BadRequestException();
        }
        return result;
    }
    async updateStatus(individualId, query, updateIndividualDto) {
        const result = await this.individualService.toogleStatus(individualId, updateIndividualDto, query);
        if (!result) {
            throw new common_1.BadRequestException();
        }
        return result;
    }
    async deleteOne(req, individualId, query) {
        (0, check_admin_role_1.checkAdminRole)(req.user.role);
        const result = await this.individualService.deleteOne(individualId, query);
        if (!result)
            throw new common_1.NotFoundException(`Nu am putut sterge persoana fizica cu id-ul ${individualId}. Poate ca aceasta persoana fizica nu exista`);
        return result;
    }
};
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccesTokenGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IndividualController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccesTokenGuard),
    (0, common_1.Get)("actives/get-all"),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], IndividualController.prototype, "findAllActives", null);
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccesTokenGuard),
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], IndividualController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccesTokenGuard),
    (0, common_1.Post)("add"),
    __param(0, (0, common_1.Query)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.CreateIndividualDto]),
    __metadata("design:returntype", Promise)
], IndividualController.prototype, "add", null);
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccesTokenGuard),
    (0, common_1.Post)("add-and-return-individual"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateIndividualDto]),
    __metadata("design:returntype", Promise)
], IndividualController.prototype, "addAndReturnIt", null);
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccesTokenGuard),
    (0, common_1.Patch)(":id/edit-individual"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, dto_1.UpdateIndividualDto]),
    __metadata("design:returntype", Promise)
], IndividualController.prototype, "editIndividual", null);
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccesTokenGuard),
    (0, common_1.Patch)(":id/update-status"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, dto_1.UpdateIndividualDto]),
    __metadata("design:returntype", Promise)
], IndividualController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccesTokenGuard),
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], IndividualController.prototype, "deleteOne", null);
IndividualController = __decorate([
    (0, common_1.Controller)("individuals"),
    __metadata("design:paramtypes", [individual_service_1.IndividualService])
], IndividualController);
exports.IndividualController = IndividualController;
//# sourceMappingURL=individual.controller.js.map