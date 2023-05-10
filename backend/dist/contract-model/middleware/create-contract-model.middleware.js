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
exports.VerifyContractModelCreate = void 0;
const common_1 = require("@nestjs/common");
const shared_middlewares_1 = require("../../utils/shared-middlewares");
const contract_model_service_1 = require("../contract-model.service");
let VerifyContractModelCreate = class VerifyContractModelCreate {
    constructor(contractModelService) {
        this.contractModelService = contractModelService;
    }
    async use(req, res, next) {
        (0, shared_middlewares_1.checkEmptyInputs)(req.body.name, req.body.content);
        const duplicate = await this.contractModelService.findOne({
            name: {
                $regex: new RegExp("^" + req.body.name.toLowerCase() + "$", "i"),
            },
        });
        if (duplicate) {
            throw new common_1.BadRequestException("Numele este deja in folosinta!");
        }
        next();
    }
};
VerifyContractModelCreate = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [contract_model_service_1.ContractModelService])
], VerifyContractModelCreate);
exports.VerifyContractModelCreate = VerifyContractModelCreate;
//# sourceMappingURL=create-contract-model.middleware.js.map