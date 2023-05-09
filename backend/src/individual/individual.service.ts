import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { getCompIndivPagination } from "src/utils/comps-indiv/shared-comp-indiv-pagination";
import { IQueryParams } from "src/utils/shared-interface";
import { CreateIndividualDto, UpdateIndividualDto } from "./dto";
import {
	IIndividual,
	IIndividualPagination,
} from "./interface/inidivual.interface";
import { Individual } from "./schemas/individual.schema";

@Injectable()
export class IndividualService {
	private ObjectId = mongoose.Types.ObjectId;
	constructor(
		@InjectModel(Individual.name)
		private individualModel: Model<Individual>
	) {}

	async create(
		newIndividual: CreateIndividualDto,
		query: IQueryParams
	): Promise<IIndividualPagination> {
		try {
			const createdIndividual = new this.individualModel(newIndividual);
			await createdIndividual.save();
			const filters = {
				pageIndex: "0",
				pageSize: query?.pageSize?.toString() || "10",
			};
			return await getCompIndivPagination(
				this.individualModel,
				filters,
				"individual"
			);
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	async createAndReturnIt(
		newIndividual: CreateIndividualDto
	): Promise<Individual> {
		try {
			const createdCompany = new this.individualModel(newIndividual);
			return await createdCompany.save();
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	async findAll(query: IQueryParams): Promise<IIndividualPagination> {
		return await getCompIndivPagination(
			this.individualModel,
			query,
			"individual"
		);
	}

	async findAllActives(query: IQueryParams): Promise<IIndividualPagination> {
		return await getCompIndivPagination(
			this.individualModel,
			query,
			"individual",
			true
		);
	}

	async findOne(query: object): Promise<IIndividual> {
		try {
			const individual = await this.individualModel.findOne(query);
			return individual;
		} catch (error) {
			return null;
		}
	}

	async updateOne(
		individualId: string,
		updateIndividualDto: UpdateIndividualDto,
		query: IQueryParams
	): Promise<IIndividualPagination> {
		try {
			await this.individualModel.updateOne(
				{ _id: new this.ObjectId(`${individualId}`) },
				updateIndividualDto
			);
			return await getCompIndivPagination(
				this.individualModel,
				query,
				"individual"
			);
		} catch (error) {
			return null;
		}
	}

	async toogleStatus(
		individualId: string,
		individual: UpdateIndividualDto,
		query: IQueryParams
	): Promise<IIndividualPagination> {
		try {
			await this.individualModel.updateOne(
				{ _id: new this.ObjectId(`${individualId}`) },
				{ isActivated: individual.isActivated }
			);
			return await getCompIndivPagination(
				this.individualModel,
				query,
				"individual"
			);
		} catch (error) {
			return null;
		}
	}

	async deleteOne(
		individualId: string,
		query: IQueryParams
	): Promise<IIndividualPagination> {
		try {
			await this.individualModel.deleteOne({
				_id: new this.ObjectId(`${individualId}`),
			});
			return await getCompIndivPagination(
				this.individualModel,
				query,
				"individual"
			);
		} catch (error) {
			return null;
		}
	}
}
