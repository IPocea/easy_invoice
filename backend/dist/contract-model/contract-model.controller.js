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
exports.ContractModelController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const access_token_guard_1 = require("../auth/guards/access-token-guard");
const contract_model_service_1 = require("./contract-model.service");
const dto_1 = require("./dto");
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");
const fs = require("fs");
const path_1 = require("path");
let ContractModelController = class ContractModelController {
    constructor(contractModelService) {
        this.contractModelService = contractModelService;
    }
    async findAll(query) {
        return await this.contractModelService.findAll(query ? query : {});
    }
    async findOne(contractModelId) {
        const ObjectId = mongoose_1.default.Types.ObjectId;
        const contractModel = await this.contractModelService.findOne({
            _id: new ObjectId(`${contractModelId}`),
        });
        if (!contractModel)
            throw new common_1.NotFoundException(`Nu am putut gasi modelul de contract cu id-ul ${contractModelId}`);
        return contractModel;
    }
    async add(createContractModelDto) {
        try {
            return await this.contractModelService.create(createContractModelDto);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async editCompany(contractModelId, query, updateContractModelDto) {
        const result = await this.contractModelService.updateOne(contractModelId, updateContractModelDto, query ? query : {});
        if (!result) {
            throw new common_1.BadRequestException();
        }
        return result;
    }
    async deleteOne(req, contractModelId, query) {
        const result = await this.contractModelService.deleteOne(contractModelId, query ? query : {});
        if (!result)
            throw new common_1.NotFoundException(`Nu am putut sterge modelul de contract cu id-ul ${contractModelId}. Poate ca acest model de contract nu exista`);
        return result;
    }
    async showContractModelAsPdf(pdfContent, res) {
        const templateFile = fs.readFileSync((0, path_1.join)((0, path_1.resolve)(process.cwd()), "src", "contract-model", "templates", "contract-model.hbs"), "utf8");
        const template = handlebars.compile(templateFile);
        const data = {
            title: pdfContent.title ? pdfContent.title : "Model de contract",
            content: pdfContent.content,
        };
        const html = template(data);
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html);
        const pdfBuffer = await page.pdf({ format: "A4" });
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `inline; filename=test.pdf`,
            "Content-Length": pdfBuffer.length,
        });
        res.send(pdfBuffer);
        await browser.close();
    }
};
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccesTokenGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ContractModelController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccesTokenGuard),
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContractModelController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccesTokenGuard),
    (0, common_1.Post)("add"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateContractModelDto]),
    __metadata("design:returntype", Promise)
], ContractModelController.prototype, "add", null);
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccesTokenGuard),
    (0, common_1.Patch)(":id/edit-contract-model"),
    __param(0, (0, common_1.Param)("id")),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, dto_1.UpdateContractModelDto]),
    __metadata("design:returntype", Promise)
], ContractModelController.prototype, "editCompany", null);
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccesTokenGuard),
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)("id")),
    __param(2, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], ContractModelController.prototype, "deleteOne", null);
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccesTokenGuard),
    (0, common_1.Post)("show-contract-model/as-pdf"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ContractModelController.prototype, "showContractModelAsPdf", null);
ContractModelController = __decorate([
    (0, common_1.Controller)("contract-models"),
    __metadata("design:paramtypes", [contract_model_service_1.ContractModelService])
], ContractModelController);
exports.ContractModelController = ContractModelController;
//# sourceMappingURL=contract-model.controller.js.map