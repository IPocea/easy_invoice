import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { IQueryParams } from "src/utils/shared-interface";
import { CreateContractModelDto, UpdateContractModelDto } from "./dto";
import {
	IContractModel,
	IContractModelResponse,
} from "./interface/contract-model.interface";
import {
	ContractModel,
	ContractModelDocument,
} from "./schemas/contract-model.schema";

@Injectable()
export class ContractModelService {
	private ObjectId = mongoose.Types.ObjectId;
	constructor(
		@InjectModel(ContractModel.name)
		private contractModel: Model<ContractModelDocument>
	) {}

	async findAll(query?: IQueryParams): Promise<IContractModel[]> {
		try {
			let options = {};
			if (query.searchValue) {
				options = { name: new RegExp(query.searchValue.toString(), "i") };
			}
			const dbQuery = this.contractModel.find(options);
			dbQuery.sort({ name: -1 });
			const contractModels = await dbQuery.exec();
			return contractModels;
		} catch (error) {
			return [];
		}
	}

	async findOne(query: object): Promise<IContractModel> {
		try {
			const contractModel = await this.contractModel.findOne(query);
			return contractModel;
		} catch (error) {
			return null;
		}
	}

	async create(
		createContractModelDto: CreateContractModelDto
	): Promise<IContractModelResponse> {
		try {
			const createdContractModel = new this.contractModel(
				createContractModelDto
			);
			const model = await createdContractModel.save();
			const models = await this.findAll({});
			return {
				models: models,
				model: model,
			};
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	async updateOne(
		contractModelId: string,
		updateContractModelDto: UpdateContractModelDto,
		query: IQueryParams
	): Promise<IContractModelResponse> {
		try {
			const model = await this.contractModel
				.findOneAndUpdate(
					{ _id: new this.ObjectId(`${contractModelId}`) },
					updateContractModelDto,
					{ new: true }
				)
				.exec();
			const models = await this.findAll(query);
			return {
				models: models,
				model: model,
			};
		} catch (error) {
			return null;
		}
	}

	async deleteOne(
		contractModelId: string,
		query: IQueryParams
	): Promise<IContractModel[]> {
		try {
			await this.contractModel.deleteOne({
				_id: new this.ObjectId(`${contractModelId}`),
			});
			return await this.findAll(query);
		} catch (error) {
			return null;
		}
	}
}
