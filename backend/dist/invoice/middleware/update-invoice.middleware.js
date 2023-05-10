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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyInvoiceUpdate = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const shared_middlewares_1 = require("../../utils/shared-middlewares");
const invoice_service_1 = require("../invoice.service");
let VerifyInvoiceUpdate = class VerifyInvoiceUpdate {
    constructor(invoiceService) {
        this.invoiceService = invoiceService;
        this.ObjectId = mongoose_1.default.Types.ObjectId;
    }
    async use(req, res, next) {
        (0, shared_middlewares_1.checkEmptyInputs)(req.body.invoice.typeOfInvoice, req.body.invoice.series, req.body.invoice.number, req.body.invoice.date, req.body.buyer.name, req.body.buyer.headquarters, req.body.buyer.county, req.body.seller.name, req.body.seller.J, req.body.seller.CUI, req.body.seller.headquarters, req.body.seller.county, req.body.seller.vatRate, req.body.contract.number, req.body.contract.subjectOfContract);
        for (const product of req.body.products) {
            (0, shared_middlewares_1.checkEmptyInputs)(product.name, product.quantity, product.unitPrice, product.VAT);
        }
        (0, shared_middlewares_1.checkIdValidity)(req.params.invoiceId);
        if (!req.body.invoice.companyId && !req.body.invoice.individualId) {
            throw new common_1.BadRequestException("Factura trebuie sa apartina unei societati sau persoane fizice");
        }
        if ((!req.body.buyer.J && !req.body.buyer.series) ||
            (!req.body.buyer.CUI && !req.body.buyer.CNP)) {
            throw new common_1.BadRequestException("Te rugam sa completezi toate campurile obligatorii");
        }
        const invoice = await this.invoiceService.findOne({
            _id: new this.ObjectId(`${req.params.invoiceId}`),
        });
        if (req.body.invoice.number !== invoice.number) {
            const duplicate = await this.invoiceService.findOne({
                number: {
                    $regex: new RegExp("^" + req.body.number + "$"),
                },
            });
            if (duplicate) {
                throw new common_1.BadRequestException(`Numarul ${req.body.number} este deja in folosinta!`);
            }
        }
        next();
    }
};
VerifyInvoiceUpdate = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [invoice_service_1.InvoiceService])
], VerifyInvoiceUpdate);
exports.VerifyInvoiceUpdate = VerifyInvoiceUpdate;
//# sourceMappingURL=update-invoice.middleware.js.map