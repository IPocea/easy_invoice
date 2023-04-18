import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { IMessageResponse, IQueryParams } from "src/utils/shared-interface";
import { CreateContractDto, UpdateContractDto } from "./dto";
import { IContract, IContractPagination } from "./interface/contract-interface";
import { Contract, ContractDocument } from "./schemas/contract.schema";
import { getContractPagination } from "./utils";

@Injectable()
export class ContractService {
	private ObjectId = Types.ObjectId;

	constructor(
		@InjectModel(Contract.name)
		private contractModel: Model<ContractDocument>
	) {}

	async create(newContract: CreateContractDto): Promise<IContract> {
		try {
			const createdContract = new this.contractModel(newContract);
			return await createdContract.save();
		} catch (error) {
			null;
		}
	}

	async findAll(query: IQueryParams): Promise<IContractPagination> {
		return await getContractPagination(this.contractModel, query);
	}

	async findOne(query: object): Promise<IContract> {
		try {
			const contract = await this.contractModel.findOne(query);
			return contract;
		} catch (error) {
			return null;
		}
	}

	async updateOne(
		contractId: Types.ObjectId,
		updateContractDto: UpdateContractDto
	): Promise<IContract> {
		try {
			return await this.contractModel.findOneAndUpdate(
				{ _id: contractId },
				updateContractDto,
				{ new: true }
			);
		} catch (error) {
			return null;
		}
	}

	async deleteOne(contractId: Types.ObjectId): Promise<IMessageResponse> {
		try {
			await this.contractModel.deleteOne({
				_id: contractId,
			});
			return { message: "Contractul a fost sters cu succes" };
		} catch (error) {
			return null;
		}
	}
}
