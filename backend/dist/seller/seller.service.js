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
exports.SellerService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const seller_schema_1 = require("./schemas/seller.schema");
let SellerService = class SellerService {
    constructor(sellerModel) {
        this.sellerModel = sellerModel;
    }
    async create(newSeller) {
        try {
            const createdSeller = new this.sellerModel(newSeller);
            return await createdSeller.save();
        }
        catch (error) {
            return null;
        }
    }
    async findOne(query) {
        try {
            const seller = await this.sellerModel.findOne(query);
            return seller;
        }
        catch (error) {
            return null;
        }
    }
    async updateOne(sellerId, updateSellerDto) {
        try {
            return await this.sellerModel.findOneAndUpdate({ _id: sellerId }, updateSellerDto, { new: true });
        }
        catch (error) {
            return null;
        }
    }
    async updateOneByInvoiceId(invoiceId, updateSellerDto) {
        try {
            return await this.sellerModel.findOneAndUpdate({ invoiceId: invoiceId }, updateSellerDto, { new: true });
        }
        catch (error) {
            return null;
        }
    }
    async deleteOne(sellerId) {
        try {
            await this.sellerModel.deleteOne({
                _id: sellerId,
            });
            return {
                message: `Vanzatorul cu id-ul ${sellerId.toString()} a fost sters`,
            };
        }
        catch (error) {
            return null;
        }
    }
    async deleteOneByInvoiceId(invoiceId) {
        try {
            await this.sellerModel.deleteOne({
                invoiceId: invoiceId,
            });
            return {
                message: `Vanzatorul a fost sters`,
            };
        }
        catch (error) {
            return null;
        }
    }
};
SellerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(seller_schema_1.Seller.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SellerService);
exports.SellerService = SellerService;
//# sourceMappingURL=seller.service.js.map