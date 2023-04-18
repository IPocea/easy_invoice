import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Seller, SellerSchema } from "./schemas/seller.schema";
import { SellerController } from "./seller.controller";
import { SellerService } from "./seller.service";

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Seller.name, schema: SellerSchema }]),
	],
	controllers: [SellerController],
	providers: [SellerService],
	exports: [SellerService],
})
export class SellerModule {}
