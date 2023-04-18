import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { IMessageResponse } from "src/utils/shared-interface";
import { CreateSellerDto, UpdateSellerDto } from "./dto";
import { ISeller } from "./interface/seller.interface";
import { Seller, SellerDocument } from "./schemas/seller.schema";

@Injectable()
export class SellerService {
	constructor(
		@InjectModel(Seller.name)
		private sellerModel: Model<SellerDocument>
	) {}

	async create(newSeller: CreateSellerDto): Promise<ISeller> {
		try {
			const createdSeller = new this.sellerModel(newSeller);
			return await createdSeller.save();
		} catch (error) {
			return null;
		}
	}

	async findOne(query: object): Promise<ISeller> {
		try {
			const seller = await this.sellerModel.findOne(query);
			return seller;
		} catch (error) {
			return null;
		}
	}

	async updateOne(
		sellerId: Types.ObjectId,
		updateSellerDto: UpdateSellerDto
	): Promise<ISeller> {
		try {
			return await this.sellerModel.findOneAndUpdate(
				{ _id: sellerId },
				updateSellerDto,
				{ new: true }
			);
		} catch (error) {
			return null;
		}
	}

	async deleteOne(sellerId: Types.ObjectId): Promise<IMessageResponse> {
		try {
			await this.sellerModel.deleteOne({
				_id: sellerId,
			});
			return {
				message: `Vanzatorul cu id-ul ${sellerId.toString()} a fost sters`,
			};
		} catch (error) {
			return null;
		}
	}
}
