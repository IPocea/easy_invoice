import { Module, Global } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { HistoryController } from "./history.controller";
import { HistoryService } from "./history.service";
import { HistoryAction, HistorySchema } from "./schemas/history-model.schema";

@Global()
@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: HistoryAction.name, schema: HistorySchema },
		]),
	],
	controllers: [HistoryController],
	providers: [HistoryService],
	exports: [HistoryService],
})
export class HistoryModule {}
