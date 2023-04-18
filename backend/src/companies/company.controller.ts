import {
	BadRequestException,
	Request,
	Body,
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	Patch,
	Post,
	Query,
	UseGuards,
} from "@nestjs/common";
import { Types } from "mongoose";
import { AccesTokenGuard } from "src/auth/guards/access-token-guard";
import { checkAdminRole } from "src/users/helpers/check-admin-role";
import { IQueryParams } from "src/utils/shared-interface";
import { CompanyService } from "./company.service";
import { CreateCompanyDto, UpdateCompanyDto } from "./dto";
import { ICompany, ICompanyPagination } from "./interface/company.interface";

@Controller("companies")
export class CompanyController {
	constructor(private readonly companyService: CompanyService) {}

	@UseGuards(AccesTokenGuard)
	@Get()
	async findAll(@Query() query: IQueryParams): Promise<ICompanyPagination> {
		return await this.companyService.findAll(query);
	}

	@UseGuards(AccesTokenGuard)
	@Get(":id")
	async findOne(@Param("id") companyId: string): Promise<ICompany> {
		const ObjectId = Types.ObjectId;
		const company = await this.companyService.findOne({
			_id: new ObjectId(`${companyId}`),
		});
		if (!company)
			throw new NotFoundException(
				`Nu am putut gasi compania cu id-ul ${companyId}`
			);
		return company;
	}

	@UseGuards(AccesTokenGuard)
	@Post("add")
	async add(
		@Query() query: IQueryParams,
		@Body() company: CreateCompanyDto
	): Promise<ICompanyPagination> {
		try {
			return await this.companyService.create(company, query);
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@UseGuards(AccesTokenGuard)
	@Post("add-and-return-company")
	async addAndReturnIt(@Body() company: CreateCompanyDto): Promise<ICompany> {
		try {
			return await this.companyService.createAndReturnIt(company);
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@UseGuards(AccesTokenGuard)
	@Patch(":id/edit-company")
	async editCompany(
		@Param("id") companyId: string,
		@Query() query: IQueryParams,
		@Body() updateCompanyDto: UpdateCompanyDto
	): Promise<ICompanyPagination> {
		const result = await this.companyService.updateOne(
			companyId,
			updateCompanyDto,
			query
		);
		if (!result) {
			throw new BadRequestException();
		}
		return result;
	}

	@UseGuards(AccesTokenGuard)
	@Patch(":id/update-status")
	async updateStatus(
		@Param("id") companyId: string,
		@Query() query: IQueryParams,
		@Body() updateCompanyDto: UpdateCompanyDto
	): Promise<ICompanyPagination> {
		const result = await this.companyService.toogleStatus(
			companyId,
			updateCompanyDto,
			query
		);
		if (!result) {
			throw new BadRequestException();
		}
		return result;
	}

	@UseGuards(AccesTokenGuard)
	@Delete(":id")
	async deleteOne(
		@Request() req,
		@Param("id") companyId: string,
		@Query() query: IQueryParams
	): Promise<ICompanyPagination> {
		checkAdminRole(req.user.role);
		const result = await this.companyService.deleteOne(companyId, query);
		if (!result)
			throw new NotFoundException(
				`Nu am putut sterge compania cu id-ul ${companyId}. Poate ca aceasta companie nu exista`
			);
		return result;
	}
}
