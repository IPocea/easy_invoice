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
exports.CompanyService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const shared_pagination_1 = require("../utils/shared-pagination");
const companies_schema_1 = require("./schemas/companies.schema");
let CompanyService = class CompanyService {
    constructor(companyModel) {
        this.companyModel = companyModel;
        this.ObjectId = mongoose_2.default.Types.ObjectId;
    }
    async create(newCompany, query) {
        var _a;
        try {
            const createdCompany = new this.companyModel(newCompany);
            await createdCompany.save();
            const filters = {
                pageIndex: "0",
                pageSize: ((_a = query === null || query === void 0 ? void 0 : query.pageSize) === null || _a === void 0 ? void 0 : _a.toString()) || "10",
            };
            return await (0, shared_pagination_1.getPagination)(this.companyModel, filters);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async findAll(query) {
        return await (0, shared_pagination_1.getPagination)(this.companyModel, query);
    }
    async findOne(query) {
        try {
            const user = await this.companyModel.findOne(query);
            return user;
        }
        catch (error) {
            return null;
        }
    }
    async updateOne(companyId, updateCompanyDto, query) {
        try {
            await this.companyModel.updateOne({ _id: new this.ObjectId(`${companyId}`) }, updateCompanyDto);
            return await (0, shared_pagination_1.getPagination)(this.companyModel, query);
        }
        catch (error) {
            return null;
        }
    }
    async toogleStatus(companyId, company, query) {
        try {
            await this.companyModel.updateOne({ _id: new this.ObjectId(`${companyId}`) }, { isActivated: company.isActivated });
            return await (0, shared_pagination_1.getPagination)(this.companyModel, query);
        }
        catch (error) {
            return null;
        }
    }
    async deleteOne(companyId, query) {
        try {
            await this.companyModel.deleteOne({
                _id: new this.ObjectId(`${companyId}`),
            });
            return await (0, shared_pagination_1.getPagination)(this.companyModel, query);
        }
        catch (error) {
            return null;
        }
    }
};
CompanyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(companies_schema_1.Company.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CompanyService);
exports.CompanyService = CompanyService;
//# sourceMappingURL=companies.service.js.map