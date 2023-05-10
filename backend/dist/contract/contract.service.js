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
exports.ContractService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const contract_schema_1 = require("./schemas/contract.schema");
const utils_1 = require("./utils");
let ContractService = class ContractService {
    constructor(contractModel) {
        this.contractModel = contractModel;
        this.ObjectId = mongoose_2.Types.ObjectId;
    }
    async create(newContract) {
        try {
            const createdContract = new this.contractModel(newContract);
            return await createdContract.save();
        }
        catch (error) {
            null;
        }
    }
    async findAll(query) {
        return await (0, utils_1.getContractPagination)(this.contractModel, query);
    }
    async findOne(query) {
        try {
            const contract = await this.contractModel.findOne(query);
            return contract;
        }
        catch (error) {
            return null;
        }
    }
    async findOneFullData(contractId) {
        try {
            const aggrArray = (0, utils_1.contractsSingleAggrArray)(contractId);
            const result = await this.contractModel.aggregate(aggrArray);
            return result[0];
        }
        catch (error) {
            return null;
        }
    }
    async updateOne(contractId, updateContractDto) {
        try {
            return await this.contractModel.findOneAndUpdate({ _id: contractId }, updateContractDto, { new: true });
        }
        catch (error) {
            return null;
        }
    }
    async updateOneByInvoiceId(invoiceId, updateContractDto) {
        try {
            return await this.contractModel.findOneAndUpdate({ invoiceId: invoiceId }, updateContractDto, { new: true });
        }
        catch (error) {
            return null;
        }
    }
    async deleteOne(contractId) {
        try {
            await this.contractModel.deleteOne({
                _id: contractId,
            });
            return { message: "Contractul a fost sters cu succes" };
        }
        catch (error) {
            return null;
        }
    }
    async deleteOneByInvoiceId(invoiceId) {
        try {
            await this.contractModel.deleteOne({
                invoiceId: invoiceId,
            });
            return {
                message: "Contractul a fost sters cu succes",
            };
        }
        catch (error) {
            return null;
        }
    }
};
ContractService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(contract_schema_1.Contract.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ContractService);
exports.ContractService = ContractService;
//# sourceMappingURL=contract.service.js.map