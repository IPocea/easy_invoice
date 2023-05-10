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
exports.ContractController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const access_token_guard_1 = require("../auth/guards/access-token-guard");
const contract_service_1 = require("./contract.service");
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");
const fs = require("fs");
const path_1 = require("path");
let ContractController = class ContractController {
    constructor(contractService) {
        this.contractService = contractService;
        this.ObjectId = mongoose_1.Types.ObjectId;
    }
    async findAll(query) {
        return await this.contractService.findAll(query);
    }
    async findOne(contractId) {
        const ObjectId = mongoose_1.default.Types.ObjectId;
        const contract = await this.contractService.findOne({
            _id: new ObjectId(`${contractId}`),
        });
        if (!contract)
            throw new common_1.NotFoundException(`Nu am putut gasi contractul cu id-ul ${contractId}`);
        return contract;
    }
    async getContractAsPdf(res, contractId) {
        const contract = await this.contractService.findOneFullData(new this.ObjectId(`${contractId}`));
        if (!contract) {
            throw new common_1.NotFoundException(`Nu am putut gasi contractul cu id-ul ${contractId}`);
        }
        const templateFile = fs.readFileSync((0, path_1.join)((0, path_1.resolve)(process.cwd()), "src", "contract", "templates", "contract.hbs"), "utf8");
        const template = handlebars.compile(templateFile);
        const html = template(contract);
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html);
        const pdfBuffer = await page.pdf({
            format: "A4",
        });
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
], ContractController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccesTokenGuard),
    (0, common_1.Get)(":id"),
    __param(0, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ContractController.prototype, "findOne", null);
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccesTokenGuard),
    (0, common_1.Get)(":id/get-pdf"),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, common_1.Param)("id")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], ContractController.prototype, "getContractAsPdf", null);
ContractController = __decorate([
    (0, common_1.Controller)("contracts"),
    __metadata("design:paramtypes", [contract_service_1.ContractService])
], ContractController);
exports.ContractController = ContractController;
//# sourceMappingURL=contract.controller.js.map