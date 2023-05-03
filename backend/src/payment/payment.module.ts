import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PaymentController } from "./payment.controller";
import { PaymentService } from "./payment.service";
import { Payment, PaymentSchema } from "./schemas/payment.schema";
import { Invoice, InvoiceSchema } from "src/invoice/schemas/invoice.schema";
import { Product, ProductSchema } from "src/product/schemas/product.schema";
import { HistoryAction, HistorySchema } from "src/history/schemas/history-model.schema";

@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: Payment.name, schema: PaymentSchema },
			{ name: Invoice.name, schema: InvoiceSchema },
			{ name: Product.name, schema: ProductSchema },
			{ name: HistoryAction.name, schema: HistorySchema },
		]),
	],
	controllers: [PaymentController],
	providers: [PaymentService],
	exports: [PaymentService],
})
export class PaymentModule {}
