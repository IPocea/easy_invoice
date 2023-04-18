import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { BuyerController } from "./buyer.controller";
import { BuyerService } from "./buyer.service";
import { Buyer, BuyerSchema } from "./schemas/buyer.schema";

@Module({
	imports: [
		MongooseModule.forFeature([{ name: Buyer.name, schema: BuyerSchema }]),
	],
	controllers: [BuyerController],
	providers: [BuyerService],
	exports: [BuyerService],
})
export class BuyerModule {}
