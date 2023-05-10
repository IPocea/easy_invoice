"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const invoice_service_1 = require("./invoice.service");
const invoice_controller_1 = require("./invoice.controller");
const invoice_schema_1 = require("./schemas/invoice.schema");
const buyer_schema_1 = require("../buyer/schemas/buyer.schema");
const seller_schema_1 = require("../seller/schemas/seller.schema");
const buyer_module_1 = require("../buyer/buyer.module");
const seller_module_1 = require("../seller/seller.module");
const seller_service_1 = require("../seller/seller.service");
const buyer_service_1 = require("../buyer/buyer.service");
const payment_schema_1 = require("../payment/schemas/payment.schema");
const product_schema_1 = require("../product/schemas/product.schema");
const product_module_1 = require("../product/product.module");
const payment_module_1 = require("../payment/payment.module");
const history_model_schema_1 = require("../history/schemas/history-model.schema");
const product_service_1 = require("../product/product.service");
const payment_service_1 = require("../payment/payment.service");
const contract_schema_1 = require("../contract/schemas/contract.schema");
const contract_module_1 = require("../contract/contract.module");
const contract_service_1 = require("../contract/contract.service");
const middleware_1 = require("./middleware");
let InvoiceModule = class InvoiceModule {
    configure(consumer) {
        consumer
            .apply(middleware_1.VerifyInvoiceCreate)
            .forRoutes({ path: "invoices/add", method: common_1.RequestMethod.POST });
        consumer.apply(middleware_1.VerifyInvoiceUpdate).forRoutes({
            path: "invoices/:invoiceId/edit-full-invoice",
            method: common_1.RequestMethod.PATCH,
        });
        consumer.apply(middleware_1.VerifyInvoiceToggleStatus).forRoutes({
            path: "invoices/:invoiceId/toggle-status",
            method: common_1.RequestMethod.PATCH,
        });
        consumer.apply(middleware_1.VerifyInvoiceDelete).forRoutes({
            path: "invoices/:invoiceId/delete-from-invoice",
            method: common_1.RequestMethod.DELETE,
        }, {
            path: "invoices/:invoiceId/delete-from-table",
            method: common_1.RequestMethod.DELETE,
        });
    }
};
InvoiceModule = __decorate([
    (0, common_1.Module)({
        imports: [
            buyer_module_1.BuyerModule,
            seller_module_1.SellerModule,
            product_module_1.ProductModule,
            payment_module_1.PaymentModule,
            contract_module_1.ContractModule,
            mongoose_1.MongooseModule.forFeature([
                { name: invoice_schema_1.Invoice.name, schema: invoice_schema_1.InvoiceSchema },
                { name: buyer_schema_1.Buyer.name, schema: buyer_schema_1.BuyerSchema },
                { name: seller_schema_1.Seller.name, schema: seller_schema_1.SellerSchema },
                { name: product_schema_1.Product.name, schema: product_schema_1.ProductSchema },
                { name: payment_schema_1.Payment.name, schema: payment_schema_1.PaymentSchema },
                { name: contract_schema_1.Contract.name, schema: contract_schema_1.ContractSchema },
                { name: history_model_schema_1.HistoryAction.name, schema: history_model_schema_1.HistorySchema },
            ]),
        ],
        controllers: [invoice_controller_1.InvoiceController],
        providers: [
            invoice_service_1.InvoiceService,
            buyer_service_1.BuyerService,
            seller_service_1.SellerService,
            product_service_1.ProductService,
            payment_service_1.PaymentService,
            contract_service_1.ContractService,
        ],
        exports: [invoice_service_1.InvoiceService],
    })
], InvoiceModule);
exports.InvoiceModule = InvoiceModule;
//# sourceMappingURL=invoice.module.js.map