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
exports.MyCompanyService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const my_company_schema_1 = require("./schemas/my-company.schema");
let MyCompanyService = class MyCompanyService {
    constructor(myCompanyModel) {
        this.myCompanyModel = myCompanyModel;
    }
    async create(newCompany) {
        try {
            return await new this.myCompanyModel(newCompany).save();
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async findAll() {
        return await this.myCompanyModel.find();
    }
    async findOne(query) {
        try {
            const myCompany = await this.myCompanyModel.findOne(query);
            return myCompany;
        }
        catch (error) {
            return null;
        }
    }
    async update(myCompanyId, myCompanyUpdate) {
        try {
            return await this.myCompanyModel.findOneAndUpdate({ _id: myCompanyId }, myCompanyUpdate, { new: true });
        }
        catch (error) {
            return null;
        }
    }
};
MyCompanyService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(my_company_schema_1.MyCompany.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], MyCompanyService);
exports.MyCompanyService = MyCompanyService;
//# sourceMappingURL=my-company.service.js.map