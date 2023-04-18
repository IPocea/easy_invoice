import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { IMessageResponse } from "src/utils/shared-interface";
import { CreateBuyerDto, UpdateBuyerDto } from "./dto";
import { IBuyer } from "./interface/buyer.interface";
import { Buyer, BuyerDocument } from "./schemas/buyer.schema";

@Injectable()
export class BuyerService {

	constructor(
		@InjectModel(Buyer.name)
		private buyerModel: Model<BuyerDocument>
	) {}

	async create(newBuyer: CreateBuyerDto): Promise<IBuyer> {
		try {
			const createdBuyer = new this.buyerModel(newBuyer);
			return await createdBuyer.save();
		} catch (error) {
			return null;
		}
	}

	async findOne(query: object): Promise<IBuyer> {
		try {
			const buyer = await this.buyerModel.findOne(query);
			return buyer;
		} catch (error) {
			return null;
		}
	}

	async updateOne(
		buyerId: Types.ObjectId,
		updateBuyerDto: UpdateBuyerDto
	): Promise<IBuyer> {
		try {
			return await this.buyerModel.findOneAndUpdate(
				{ _id: buyerId },
				updateBuyerDto,
				{ new: true }
			);
		} catch (error) {
			return null;
		}
	}

	async deleteOne(buyerId: Types.ObjectId): Promise<IMessageResponse> {
		try {
			await this.buyerModel.deleteOne({
				_id: buyerId,
			});
			return {
				message: `Cumparatorul cu id-ul ${buyerId.toString()} a fost sters`,
			};
		} catch (error) {
			return null;
		}
	}
}
