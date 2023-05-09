import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import { getCompIndivPagination } from "src/utils/comps-indiv/shared-comp-indiv-pagination";
import { IQueryParams } from "src/utils/shared-interface";
import { CreateCompanyDto, UpdateCompanyDto } from "./dto";
import { ICompany, ICompanyPagination } from "./interface/company.interface";
import { Company, CompanyDocument } from "./schemas/company.schema";

@Injectable()
export class CompanyService {
	private ObjectId = mongoose.Types.ObjectId;
	constructor(
		@InjectModel(Company.name)
		private companyModel: Model<CompanyDocument>
	) {}

	async create(
		newCompany: CreateCompanyDto,
		query: IQueryParams
	): Promise<ICompanyPagination> {
		try {
			const createdCompany = new this.companyModel(newCompany);
			await createdCompany.save();
			const filters = {
				pageIndex: "0",
				pageSize: query?.pageSize?.toString() || "10",
			};
			return await getCompIndivPagination(
				this.companyModel,
				filters,
				"company"
			);
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	async createAndReturnIt(newCompany: CreateCompanyDto): Promise<ICompany> {
		try {
			const createdCompany = new this.companyModel(newCompany);
			return await createdCompany.save();
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	async findAll(query: IQueryParams): Promise<ICompanyPagination> {
		return await getCompIndivPagination(this.companyModel, query, "company");
	}

	async findAllActives(query: IQueryParams): Promise<ICompanyPagination> {
		return await getCompIndivPagination(this.companyModel, query, "company", true);
	}

	async findOne(query: object): Promise<ICompany> {
		try {
			const company = await this.companyModel.findOne(query);
			return company;
		} catch (error) {
			return null;
		}
	}

	async updateOne(
		companyId: string,
		updateCompanyDto: UpdateCompanyDto,
		query: IQueryParams
	): Promise<ICompanyPagination> {
		try {
			await this.companyModel.updateOne(
				{ _id: new this.ObjectId(`${companyId}`) },
				updateCompanyDto
			);
			return await getCompIndivPagination(this.companyModel, query, "company");
		} catch (error) {
			return null;
		}
	}

	async toogleStatus(
		companyId: string,
		company: UpdateCompanyDto,
		query: IQueryParams
	): Promise<ICompanyPagination> {
		try {
			await this.companyModel.updateOne(
				{ _id: new this.ObjectId(`${companyId}`) },
				{ isActivated: company.isActivated }
			);
			return await getCompIndivPagination(this.companyModel, query, "company");
		} catch (error) {
			return null;
		}
	}

	async deleteOne(
		companyId: string,
		query: IQueryParams
	): Promise<ICompanyPagination> {
		try {
			await this.companyModel.deleteOne({
				_id: new this.ObjectId(`${companyId}`),
			});
			return await getCompIndivPagination(this.companyModel, query, "company");
		} catch (error) {
			return null;
		}
	}
}
