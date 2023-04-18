import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { CreateMyCompanyDto } from "./dto/create-my-company.dto";
import { UpdateMyCompanyDto } from "./dto/update-my-company.dto";
import { IMyCompany } from "./interface/my-company.interface";
import { MyCompany, MyCompanyDocument } from "./schemas/my-company.schema";

@Injectable()
export class MyCompanyService {
	constructor(
		@InjectModel(MyCompany.name)
		private myCompanyModel: Model<MyCompanyDocument>
	) {}

	async create(newCompany: CreateMyCompanyDto): Promise<IMyCompany> {
		try {
			return await new this.myCompanyModel(newCompany).save();
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	async findAll(): Promise<IMyCompany[]> {
		return await this.myCompanyModel.find();
	}

	async findOne(query: object): Promise<IMyCompany> {
		try {
			const myCompany = await this.myCompanyModel.findOne(query);
			return myCompany;
		} catch (error) {
			return null;
		}
	}

	async update(
		myCompanyId: string,
		myCompanyUpdate: UpdateMyCompanyDto
	): Promise<IMyCompany> {
		try {
			return await this.myCompanyModel.findOneAndUpdate(
				{ _id: myCompanyId },
				myCompanyUpdate,
				{ new: true }
			);
		} catch (error) {
			return null;
		}
	}
}
