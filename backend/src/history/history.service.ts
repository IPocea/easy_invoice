import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { IMessageResponse } from "src/utils/shared-interface";
import { CreateHistoryActionDto } from "./dto";
import { IHistoryAction } from "./interface/history.interface";
import { HistoryAction, HistoryDocument } from "./schemas/history-model.schema";

@Injectable()
export class HistoryService {
	private ObjectId = Types.ObjectId;
	constructor(
		@InjectModel(HistoryAction.name)
		private historyModel: Model<HistoryDocument>
	) {}

	async create(newAction: CreateHistoryActionDto): Promise<IHistoryAction> {
		try {
			const createdAction = new this.historyModel(newAction);
			return await createdAction.save();
		} catch (error) {
			return null;
		}
	}

	async findOne(query: object): Promise<IHistoryAction> {
		try {
			const action = await this.historyModel.findOne(query);
			return action;
		} catch (error) {
			return null;
		}
	}

	async deleteManyByInvoiceId(
		invoiceId: Types.ObjectId
	): Promise<IMessageResponse> {
		try {
			const result = await this.historyModel.deleteMany({
				invoiceId: invoiceId,
			});
			if (result) {
				return {
					message: `Istoricul pentru factura cu id-ul ${invoiceId.toString()} a fost sters`,
				};
			}
		} catch (error) {
			return null;
		}
	}

	async deleteMany(query: object): Promise<IMessageResponse> {
		try {
			const result = await this.historyModel.deleteMany(query);
			if (result) {
				return {
					message: `Istoricul pentru factura selectata a fost sters`,
				};
			}
		} catch (error) {
			return null;
		}
	}
}
