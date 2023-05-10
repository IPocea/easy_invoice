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
exports.InvoiceController = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("mongoose");
const access_token_guard_1 = require("../auth/guards/access-token-guard");
const history_service_1 = require("../history/history.service");
const dto_1 = require("./dto");
const invoice_service_1 = require("./invoice.service");
const puppeteer = require("puppeteer");
const handlebars = require("handlebars");
const fs = require("fs");
const path_1 = require("path");
const helpers_1 = require("./handlebars-helpers/helpers");
const check_admin_role_1 = require("../users/helpers/check-admin-role");
let InvoiceController = class InvoiceController {
    constructor(invoiceService, historyService) {
        this.invoiceService = invoiceService;
        this.historyService = historyService;
        this.ObjectId = mongoose_1.Types.ObjectId;
    }
    async findAll(query) {
        return await this.invoiceService.findAllFullInvoice(query);
    }
    async findOneFullData(invoiceId) {
        try {
            const invoice = await this.invoiceService.findOneFullData(new this.ObjectId(`${invoiceId}`));
            return invoice;
        }
        catch (error) {
            throw new common_1.NotFoundException(`Nu am putut gasi factura cu id-ul ${invoiceId}`);
        }
    }
    async add(req, fullInvoice) {
        try {
            const result = await this.invoiceService.create(fullInvoice);
            if (result) {
                await this.historyService.create({
                    actionDescription: "Factura a fost adaugata",
                    addedBy: req.user.firstName + " " + req.user.lastName,
                    invoiceId: result._id,
                });
                return result;
            }
        }
        catch (error) {
            throw new common_1.BadRequestException(error.message);
        }
    }
    async editFullInvoice(req, invoiceId, updateFullInvoice) {
        const result = await this.invoiceService.updateFullInvoice(updateFullInvoice, new this.ObjectId(`${invoiceId}`));
        if (!result) {
            throw new common_1.BadRequestException();
        }
        await this.historyService.create({
            actionDescription: "Factura a fost modificata",
            addedBy: req.user.firstName + " " + req.user.lastName,
            invoiceId: result._id,
        });
        return result;
    }
    async toggleInvoiceStatus(invoiceId, updateInvoiceDto) {
        const invoiceObjectId = new this.ObjectId(`${invoiceId}`);
        const userName = updateInvoiceDto.editedBy;
        const result = await this.invoiceService.updateOne(invoiceObjectId, updateInvoiceDto);
        if (result) {
            const actionDescription = updateInvoiceDto.isCancelled
                ? "Factura a fost anulata"
                : "Factura a fost reactivata";
            await this.historyService.create({
                actionDescription: actionDescription,
                addedBy: userName,
                invoiceId: invoiceObjectId,
            });
            return await this.invoiceService.findOneFullData(invoiceObjectId);
        }
        else {
            throw new common_1.BadRequestException("O eroare neprevazuta a intervenit. Te rugam sa faci refresh la pagina si sa incerci din nou");
        }
    }
    async deleteOneFromTable(invoiceIdString, query, req) {
        (0, check_admin_role_1.checkAdminRole)(req.user.role);
        const invoiceId = new this.ObjectId(`${invoiceIdString}`);
        const result = await this.invoiceService.deleteFullInvoice(invoiceId);
        if (!result)
            throw new common_1.NotFoundException(`Nu am putut sterge factura cu id-ul ${invoiceId.toString()}. Poate ca aceasta persoana factura nu exista`);
        await this.historyService.deleteManyByInvoiceId(invoiceId);
        return await this.invoiceService.findAllFullInvoice(query);
    }
    async deleteOne(invoiceIdString, req) {
        (0, check_admin_role_1.checkAdminRole)(req.user.role);
        const invoiceId = new this.ObjectId(`${invoiceIdString}`);
        const result = await this.invoiceService.deleteFullInvoice(invoiceId);
        if (!result)
            throw new common_1.NotFoundException(`Nu am putut sterge factura cu id-ul ${invoiceId.toString()}. Poate ca aceasta persoana factura nu exista`);
        await this.historyService.deleteManyByInvoiceId(invoiceId);
        return result;
    }
    async generatePdf(invoiceId, res) {
        const invoice = await this.invoiceService.findOneFullData(new this.ObjectId(`${invoiceId}`));
        if (!invoice) {
            throw new common_1.NotFoundException(`Nu exista o factura cu id-ul ${invoiceId}`);
        }
        const templateFile = fs.readFileSync((0, path_1.join)((0, path_1.resolve)(process.cwd()), "src", "invoice", "templates", "invoice.hbs"), "utf8");
        handlebars.registerHelper("notice-number", (0, helpers_1.getNoticeNumberHelper)());
        handlebars.registerHelper("is-cancelled", (0, helpers_1.getIsCancelledHelper)());
        handlebars.registerHelper("date-format", (0, helpers_1.getDateFormatHelper)());
        handlebars.registerHelper("index-plus-one", (0, helpers_1.getIndexPlusOneHelper)());
        handlebars.registerHelper("total-of-product", (0, helpers_1.getTotalOfProductHelper)());
        handlebars.registerHelper("vat-of-product", (0, helpers_1.getVatOfProductHelper)());
        handlebars.registerHelper("total-vat", (0, helpers_1.getTotalVatHelper)());
        const template = handlebars.compile(templateFile);
        const html = template(invoice);
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.setContent(html);
        const pdfBuffer = await page.pdf({ format: "A4" });
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `inline; filename=test.pdf`,
            "Content-Length": pdfBuffer.length,
        });
        res.send(pdfBuffer);
        await browser.close();
    }
};
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccesTokenGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "findAll", null);
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccesTokenGuard),
    (0, common_1.Get)(":invoiceId"),
    __param(0, (0, common_1.Param)("invoiceId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "findOneFullData", null);
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccesTokenGuard),
    (0, common_1.Post)("add"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, dto_1.CreateFullInvoiceDto]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "add", null);
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccesTokenGuard),
    (0, common_1.Patch)(":invoiceId/edit-full-invoice"),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Param)("invoiceId")),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, dto_1.UpdateFullInvoiceDto]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "editFullInvoice", null);
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccesTokenGuard),
    (0, common_1.Patch)(":invoiceId/toggle-status"),
    __param(0, (0, common_1.Param)("invoiceId")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateInvoiceDto]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "toggleInvoiceStatus", null);
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccesTokenGuard),
    (0, common_1.Delete)(":invoiceId/delete-from-table"),
    __param(0, (0, common_1.Param)("invoiceId")),
    __param(1, (0, common_1.Query)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "deleteOneFromTable", null);
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccesTokenGuard),
    (0, common_1.Delete)(":invoiceId/delete-from-invoice"),
    __param(0, (0, common_1.Param)("invoiceId")),
    __param(1, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "deleteOne", null);
__decorate([
    (0, common_1.UseGuards)(access_token_guard_1.AccesTokenGuard),
    (0, common_1.Get)(":invoiceId/generate-pdf"),
    __param(0, (0, common_1.Param)("invoiceId")),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], InvoiceController.prototype, "generatePdf", null);
InvoiceController = __decorate([
    (0, common_1.Controller)("invoices"),
    __metadata("design:paramtypes", [invoice_service_1.InvoiceService,
        history_service_1.HistoryService])
], InvoiceController);
exports.InvoiceController = InvoiceController;
//# sourceMappingURL=invoice.controller.js.map