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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("./schemas/product.schema");
let ProductService = class ProductService {
    constructor(productModel) {
        this.productModel = productModel;
    }
    async findAllOfInvoice(invoiceId) {
        try {
            return await this.productModel.find({
                invoiceId: invoiceId,
            });
        }
        catch (error) {
            return null;
        }
    }
    async create(newProduct) {
        try {
            const createdProduct = new this.productModel(newProduct);
            return await createdProduct.save();
        }
        catch (error) {
            return null;
        }
    }
    async createMany(newProducts) {
        try {
            const result = await this.productModel.insertMany(newProducts);
            if (result) {
                return { message: "Produsele au fost adaugate" };
            }
        }
        catch (error) {
            return null;
        }
    }
    async findOne(query) {
        try {
            const product = await this.productModel.findOne(query);
            return product;
        }
        catch (error) {
            return null;
        }
    }
    async updateOne(productId, updatedProductDto) {
        try {
            await this.productModel.updateOne({ _id: productId }, updatedProductDto);
            return {
                message: "Produsul a fost actualizat",
            };
        }
        catch (error) {
            return null;
        }
    }
    async deleteOne(productId) {
        try {
            await this.productModel.deleteOne({
                _id: productId,
            });
            return {
                message: `Produsul cu id-ul ${productId.toString()} a fost sters`,
            };
        }
        catch (error) {
            return null;
        }
    }
    async deleteManyByInvoiceId(invoiceId) {
        try {
            const result = await this.productModel.deleteMany({
                invoiceId: invoiceId,
            });
            if (result) {
                return {
                    message: `Produsele pentru factura cu id-ul ${invoiceId.toString()} au fost sterse`,
                };
            }
        }
        catch (error) {
            return null;
        }
    }
    async deleteMany(query) {
        try {
            const result = await this.productModel.deleteMany(query);
            if (result) {
                return {
                    message: `Produsele pentru factura selectata au fost sterse`,
                };
            }
        }
        catch (error) {
            return null;
        }
    }
};
ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ProductService);
exports.ProductService = ProductService;
//# sourceMappingURL=product.service.js.map