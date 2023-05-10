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
exports.IndividualService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shared_comp_indiv_pagination_1 = require("../utils/comps-indiv/shared-comp-indiv-pagination");
const individual_schema_1 = require("./schemas/individual.schema");
let IndividualService = class IndividualService {
    constructor(individualModel) {
        this.individualModel = individualModel;
        this.ObjectId = mongoose_2.default.Types.ObjectId;
    }
    async create(newIndividual, query) {
        var _a;
        try {
            const createdIndividual = new this.individualModel(newIndividual);
            await createdIndividual.save();
            const filters = {
                pageIndex: "0",
                pageSize: ((_a = query === null || query === void 0 ? void 0 : query.pageSize) === null || _a === void 0 ? void 0 : _a.toString()) || "10",
            };
            return await (0, shared_comp_indiv_pagination_1.getCompIndivPagination)(this.individualModel, filters, "individual");
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async createAndReturnIt(newIndividual) {
        try {
            const createdCompany = new this.individualModel(newIndividual);
            return await createdCompany.save();
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async findAll(query) {
        return await (0, shared_comp_indiv_pagination_1.getCompIndivPagination)(this.individualModel, query, "individual");
    }
    async findAllActives(query) {
        return await (0, shared_comp_indiv_pagination_1.getCompIndivPagination)(this.individualModel, query, "individual", true);
    }
    async findOne(query) {
        try {
            const individual = await this.individualModel.findOne(query);
            return individual;
        }
        catch (error) {
            return null;
        }
    }
    async updateOne(individualId, updateIndividualDto, query) {
        try {
            await this.individualModel.updateOne({ _id: new this.ObjectId(`${individualId}`) }, updateIndividualDto);
            return await (0, shared_comp_indiv_pagination_1.getCompIndivPagination)(this.individualModel, query, "individual");
        }
        catch (error) {
            return null;
        }
    }
    async toogleStatus(individualId, individual, query) {
        try {
            await this.individualModel.updateOne({ _id: new this.ObjectId(`${individualId}`) }, { isActivated: individual.isActivated });
            return await (0, shared_comp_indiv_pagination_1.getCompIndivPagination)(this.individualModel, query, "individual");
        }
        catch (error) {
            return null;
        }
    }
    async deleteOne(individualId, query) {
        try {
            await this.individualModel.deleteOne({
                _id: new this.ObjectId(`${individualId}`),
            });
            return await (0, shared_comp_indiv_pagination_1.getCompIndivPagination)(this.individualModel, query, "individual");
        }
        catch (error) {
            return null;
        }
    }
};
IndividualService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(individual_schema_1.Individual.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], IndividualService);
exports.IndividualService = IndividualService;
//# sourceMappingURL=individual.service.js.map