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
exports.BuyerService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const buyer_schema_1 = require("./schemas/buyer.schema");
let BuyerService = class BuyerService {
    constructor(buyerModel) {
        this.buyerModel = buyerModel;
    }
    async create(newBuyer) {
        try {
            const createdBuyer = new this.buyerModel(newBuyer);
            return await createdBuyer.save();
        }
        catch (error) {
            return null;
        }
    }
    async findOne(query) {
        try {
            const buyer = await this.buyerModel.findOne(query);
            return buyer;
        }
        catch (error) {
            return null;
        }
    }
    async updateOne(buyerId, updateBuyerDto) {
        try {
            return await this.buyerModel.findOneAndUpdate({ _id: buyerId }, updateBuyerDto, { new: true });
        }
        catch (error) {
            return null;
        }
    }
    async updateOneByInvoiceId(invoiceId, updateBuyerDto) {
        try {
            const actualBuyer = await this.findOne({
                invoiceId: invoiceId,
            });
            if ((actualBuyer.CUI && updateBuyerDto.CUI) ||
                (actualBuyer.CNP && updateBuyerDto.CNP)) {
                return await this.buyerModel.findOneAndUpdate({ invoiceId: invoiceId }, updateBuyerDto, { new: true });
            }
            else {
                await this.deleteOne(actualBuyer._id);
                const newBuyerDto = updateBuyerDto;
                const newBuyer = await this.create(newBuyerDto);
                return newBuyer;
            }
        }
        catch (error) {
            return null;
        }
    }
    async deleteOne(buyerId) {
        try {
            await this.buyerModel.deleteOne({
                _id: buyerId,
            });
            return {
                message: `Cumparatorul cu id-ul ${buyerId.toString()} a fost sters`,
            };
        }
        catch (error) {
            return null;
        }
    }
    async deleteOneByInvoiceId(invoiceId) {
        try {
            await this.buyerModel.deleteOne({
                invoiceId: invoiceId,
            });
            return {
                message: `Cumparatorul a fost sters`,
            };
        }
        catch (error) {
            return null;
        }
    }
};
BuyerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(buyer_schema_1.Buyer.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], BuyerService);
exports.BuyerService = BuyerService;
//# sourceMappingURL=buyer.service.js.map