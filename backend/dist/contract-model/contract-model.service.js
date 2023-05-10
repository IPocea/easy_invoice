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
exports.ContractModelService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const contract_model_schema_1 = require("./schemas/contract-model.schema");
let ContractModelService = class ContractModelService {
    constructor(contractModel) {
        this.contractModel = contractModel;
        this.ObjectId = mongoose_2.default.Types.ObjectId;
    }
    async findAll(query) {
        try {
            let options = {};
            if (query.searchValue) {
                options = { name: new RegExp(query.searchValue.toString(), "i") };
            }
            const dbQuery = this.contractModel.find(options);
            dbQuery.sort({ name: -1 });
            const contractModels = await dbQuery.exec();
            return contractModels;
        }
        catch (error) {
            return [];
        }
    }
    async findOne(query) {
        try {
            const contractModel = await this.contractModel.findOne(query);
            return contractModel;
        }
        catch (error) {
            return null;
        }
    }
    async create(createContractModelDto) {
        try {
            const createdContractModel = new this.contractModel(createContractModelDto);
            const model = await createdContractModel.save();
            const models = await this.findAll({});
            return {
                models: models,
                model: model,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async updateOne(contractModelId, updateContractModelDto, query) {
        try {
            const model = await this.contractModel
                .findOneAndUpdate({ _id: new this.ObjectId(`${contractModelId}`) }, updateContractModelDto, { new: true })
                .exec();
            const models = await this.findAll(query);
            return {
                models: models,
                model: model,
            };
        }
        catch (error) {
            return null;
        }
    }
    async deleteOne(contractModelId, query) {
        try {
            await this.contractModel.deleteOne({
                _id: new this.ObjectId(`${contractModelId}`),
            });
            return await this.findAll(query);
        }
        catch (error) {
            return null;
        }
    }
};
ContractModelService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(contract_model_schema_1.ContractModel.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ContractModelService);
exports.ContractModelService = ContractModelService;
//# sourceMappingURL=contract-model.service.js.map