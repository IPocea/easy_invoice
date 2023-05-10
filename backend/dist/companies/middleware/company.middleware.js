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
exports.VerifyCompany = void 0;
const common_1 = require("@nestjs/common");
const shared_middlewares_1 = require("../../utils/shared-middlewares");
const company_service_1 = require("../company.service");
let VerifyCompany = class VerifyCompany {
    constructor(companyService) {
        this.companyService = companyService;
    }
    async use(req, res, next) {
        (0, shared_middlewares_1.checkEmptyInputs)(req.body.name, req.body.J, req.body.CUI, req.body.headquarters, req.body.county);
        const duplicate = await this.companyService.findOne({
            CUI: {
                $regex: new RegExp("^" + req.body.CUI.toLowerCase() + "$", "i"),
            },
        });
        if (duplicate) {
            throw new common_1.BadRequestException(`CUI-ul ${req.body.CUI} este deja in folosinta!`);
        }
        next();
    }
};
VerifyCompany = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [company_service_1.CompanyService])
], VerifyCompany);
exports.VerifyCompany = VerifyCompany;
//# sourceMappingURL=company.middleware.js.map