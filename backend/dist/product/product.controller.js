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
exports.ProductController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const access_token_guard_1 = require("../auth/guards/access-token-guard");
const product_service_1 = require("./product.service");
let ProductController = class ProductController {
    constructor(productService) {
        this.productService = productService;
        this.ObjectId = mongoose_1.Types.ObjectId;
    }
    async getAllOfInvoice(invoiceId) {
        return await this.productService.findAllOfInvoice(new this.ObjectId(`${invoiceId}`));
    }
    async deleteOne(productId) {
        const result = await this.productService.deleteOne(new this.ObjectId(`${productId}`));
        if (result) {
            return { message: `Produsul cu id-ul ${productId} a fost sters` };
        }
        else {
            throw new common_1.NotFoundException(`Nu am putut gasi produsul cu id-ul ${productId}. Poate ca produsul nu exista`);
        }
    }
};
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccesTokenGuard),
    (0, common_1.Get)(":invoiceId"),
    __param(0, (0, common_1.Param)("invoiceId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getAllOfInvoice", null);
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccesTokenGuard),
    (0, common_1.Delete)(":productId"),
    __param(0, (0, common_1.Param)("productId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "deleteOne", null);
ProductController = __decorate([
    (0, common_1.Controller)("products"),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], ProductController);
exports.ProductController = ProductController;
//# sourceMappingURL=product.controller.js.map