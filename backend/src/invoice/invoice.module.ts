import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { InvoiceService } from "./invoice.service";
import { InvoiceController } from "./invoice.controller";
import { Invoice, InvoiceSchema } from "./schemas/invoice.schema";
import { Buyer, BuyerSchema } from "src/buyer/schemas/buyer.schema";
import { Seller, SellerSchema } from "src/seller/schemas/seller.schema";
import { BuyerModule } from "src/buyer/buyer.module";
import { SellerModule } from "src/seller/seller.module";
import { SellerService } from "src/seller/seller.service";
import { BuyerService } from "src/buyer/buyer.service";
import { Payment, PaymentSchema } from "src/payment/schemas/payment.schema";
import { Product, ProductSchema } from "src/product/schemas/product.schema";
import { ProductModule } from "src/product/product.module";
import { PaymentModule } from "src/payment/payment.module";
import {
	HistoryAction,
	HistorySchema,
} from "src/history/schemas/history-model.schema";
import { ProductService } from "src/product/product.service";
import { PaymentService } from "src/payment/payment.service";
import { Contract, ContractSchema } from "src/contract/schemas/contract.schema";
import { ContractModule } from "src/contract/contract.module";
import { ContractService } from "src/contract/contract.service";
import { VerifyInvoiceCreate, VerifyInvoiceUpdate } from "./middleware";

@Module({
	imports: [
		BuyerModule,
		SellerModule,
		ProductModule,
		PaymentModule,
		ContractModule,
		MongooseModule.forFeature([
			{ name: Invoice.name, schema: InvoiceSchema },
			{ name: Buyer.name, schema: BuyerSchema },
			{ name: Seller.name, schema: SellerSchema },
			{ name: Product.name, schema: ProductSchema },
			{ name: Payment.name, schema: PaymentSchema },
			{ name: Contract.name, schema: ContractSchema },
			{ name: HistoryAction.name, schema: HistorySchema },
		]),
	],
	controllers: [InvoiceController],
	providers: [
		InvoiceService,
		BuyerService,
		SellerService,
		ProductService,
		PaymentService,
		ContractService,
	],
	exports: [InvoiceService],
})
export class InvoiceModule {
	configure(consumer: MiddlewareConsumer) {
		consumer
			.apply(VerifyInvoiceCreate)
			.forRoutes({ path: "invoices/add", method: RequestMethod.POST });
		consumer.apply(VerifyInvoiceUpdate).forRoutes({
			path: "invoices/edit-full-invoice",
			method: RequestMethod.PATCH,
		});
	}
}
