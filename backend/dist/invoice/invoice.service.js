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
exports.InvoiceService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const buyer_service_1 = require("../buyer/buyer.service");
const product_service_1 = require("../product/product.service");
const seller_service_1 = require("../seller/seller.service");
const invoice_schema_1 = require("./schemas/invoice.schema");
const invoice_pagination_1 = require("./utils/invoice-pagination");
const single_invoice_aggregation_array_1 = require("./utils/single-invoice-aggregation-array");
const contract_service_1 = require("../contract/contract.service");
const shared_operators_1 = require("../utils/shared-operators");
const payment_service_1 = require("../payment/payment.service");
let InvoiceService = class InvoiceService {
    constructor(invoiceModel, buyerService, sellerService, contractService, productService, paymentService) {
        this.invoiceModel = invoiceModel;
        this.buyerService = buyerService;
        this.sellerService = sellerService;
        this.contractService = contractService;
        this.productService = productService;
        this.paymentService = paymentService;
        this.ObjectId = mongoose_2.Types.ObjectId;
    }
    async findAllFullInvoice(query) {
        return await (0, invoice_pagination_1.getFullInvoicePagination)(this.invoiceModel, query);
    }
    async findOne(query) {
        try {
            return await this.invoiceModel.findOne(query);
        }
        catch (error) {
            return null;
        }
    }
    async findOneFullData(invoiceId) {
        try {
            const aggArray = (0, single_invoice_aggregation_array_1.getSglInvoiceAggrArray)(invoiceId);
            const result = await this.invoiceModel.aggregate(aggArray);
            return result[0] ? result[0] : null;
        }
        catch (error) {
            return null;
        }
    }
    async create(newFullInvoice) {
        try {
            if (newFullInvoice.invoice.companyId) {
                newFullInvoice.invoice.companyId = new this.ObjectId(`${newFullInvoice.invoice.companyId}`);
            }
            else {
                newFullInvoice.invoice.individualId = new this.ObjectId(`${newFullInvoice.invoice.individualId}`);
            }
            const invoice = new this.invoiceModel(newFullInvoice.invoice);
            await invoice.save();
            const buyerDto = newFullInvoice.buyer;
            buyerDto.invoiceId = invoice._id;
            const buyer = await this.buyerService.create(buyerDto);
            const sellerDto = newFullInvoice.seller;
            sellerDto.invoiceId = invoice._id;
            delete sellerDto._id;
            const seller = await this.sellerService.create(sellerDto);
            const contractDto = newFullInvoice.contract;
            contractDto.invoiceId = invoice._id;
            const contract = await this.contractService.create(contractDto);
            if (buyer && seller && contract) {
                for (const productDto of newFullInvoice.products) {
                    productDto.invoiceId = invoice._id;
                    productDto.unitPrice = (0, shared_operators_1.multiply)(productDto.unitPrice, 100);
                    await this.productService.create(productDto);
                }
                return await this.findOneFullData(invoice._id);
            }
            else {
                throw new common_1.BadRequestException("O eroare neprevazuta a avut loc. Te rugam sa faci refresh la pagina si sa reincerci");
            }
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async updateFullInvoice(updateFullInvoice, invoiceId) {
        try {
            updateFullInvoice.buyer.invoiceId = invoiceId;
            if (updateFullInvoice.invoice.companyId) {
                updateFullInvoice.invoice.companyId = new this.ObjectId(`${updateFullInvoice.invoice.companyId}`);
            }
            else {
                updateFullInvoice.invoice.individualId = new this.ObjectId(`${updateFullInvoice.invoice.individualId}`);
            }
            await this.buyerService.updateOneByInvoiceId(invoiceId, updateFullInvoice.buyer);
            await this.sellerService.updateOneByInvoiceId(invoiceId, updateFullInvoice.seller);
            await this.contractService.updateOneByInvoiceId(invoiceId, updateFullInvoice.contract);
            for (const product of updateFullInvoice.products) {
                product.unitPrice = (0, shared_operators_1.multiply)(product.unitPrice, 100);
                if (product._id) {
                    product._id = new this.ObjectId(`${product._id}`);
                    await this.productService.updateOne(product._id, product);
                }
                else {
                    const newProduct = {
                        name: product.name,
                        quantity: product.quantity,
                        unitPrice: product.unitPrice,
                        VAT: product.VAT,
                        invoiceId: invoiceId,
                        UM: product.UM,
                    };
                    await this.productService.create(newProduct);
                }
            }
            await this.updateOne(invoiceId, updateFullInvoice.invoice);
            return await this.findOneFullData(invoiceId);
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async updateOne(invoiceId, updateInvoiceDto) {
        try {
            await this.invoiceModel.updateOne({ _id: invoiceId }, updateInvoiceDto);
            return { message: "Factura a fost actualizata cu succes" };
        }
        catch (error) {
            return null;
        }
    }
    async deleteFullInvoice(invoiceId) {
        try {
            await this.productService.deleteManyByInvoiceId(invoiceId);
            await this.buyerService.deleteOneByInvoiceId(invoiceId);
            await this.sellerService.deleteOneByInvoiceId(invoiceId);
            await this.contractService.deleteOneByInvoiceId(invoiceId);
            await this.paymentService.deleteManyByInvoiceId(invoiceId);
            const result = await this.deleteOne(invoiceId);
            if (result) {
                return result;
            }
            else {
                throw new common_1.BadRequestException("O eroare neasteptata a intervenit. Te rugam sa faci refresh la pagina si sa incerci din nou");
            }
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async deleteOne(invoiceId) {
        try {
            const result = await this.invoiceModel.deleteOne({
                _id: invoiceId,
            });
            if (result) {
                return { message: "Factura a fost stearsa cu succes" };
            }
            else {
                return null;
            }
        }
        catch (error) {
            return null;
        }
    }
};
InvoiceService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(invoice_schema_1.Invoice.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        buyer_service_1.BuyerService,
        seller_service_1.SellerService,
        contract_service_1.ContractService,
        product_service_1.ProductService,
        payment_service_1.PaymentService])
], InvoiceService);
exports.InvoiceService = InvoiceService;
//# sourceMappingURL=invoice.service.js.map