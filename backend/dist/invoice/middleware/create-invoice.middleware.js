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
exports.VerifyInvoiceCreate = void 0;
const common_1 = require("@nestjs/common");
const shared_middlewares_1 = require("../../utils/shared-middlewares");
const invoice_service_1 = require("../invoice.service");
let VerifyInvoiceCreate = class VerifyInvoiceCreate {
    constructor(invoiceService) {
        this.invoiceService = invoiceService;
    }
    async use(req, res, next) {
        (0, shared_middlewares_1.checkEmptyInputs)(req.body.invoice.typeOfInvoice, req.body.invoice.series, req.body.invoice.number, req.body.invoice.date, req.body.buyer.name, req.body.buyer.headquarters, req.body.buyer.county, req.body.seller.name, req.body.seller.J, req.body.seller.CUI, req.body.seller.headquarters, req.body.seller.county, req.body.seller.vatRate, req.body.contract.number, req.body.contract.subjectOfContract);
        for (const product of req.body.products) {
            (0, shared_middlewares_1.checkEmptyInputs)(product.name, product.quantity, product.unitPrice, product.VAT);
        }
        if (!req.body.invoice.companyId && !req.body.invoice.individualId) {
            throw new common_1.BadRequestException("Factura trebuie sa apartina unei societati sau persoane fizice");
        }
        if ((!req.body.buyer.J && !req.body.buyer.series) ||
            (!req.body.buyer.CUI && !req.body.buyer.CNP)) {
            throw new common_1.BadRequestException("Te rugam sa completezi toate campurile obligatorii");
        }
        const duplicate = await this.invoiceService.findOne({
            number: {
                $regex: new RegExp("^" + req.body.invoice.number + "$"),
            },
        });
        if (duplicate) {
            throw new common_1.BadRequestException(`Numarul de factura ${req.body.invoice.number} este deja in folosinta!`);
        }
        next();
    }
};
VerifyInvoiceCreate = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [invoice_service_1.InvoiceService])
], VerifyInvoiceCreate);
exports.VerifyInvoiceCreate = VerifyInvoiceCreate;
//# sourceMappingURL=create-invoice.middleware.js.map