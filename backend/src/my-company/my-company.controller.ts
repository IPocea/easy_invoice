import {
	Controller,
	Get,
	UseGuards,
	Body,
	Post,
	Request,
	BadRequestException,
	Patch,
	Param,
	NotFoundException,
	Put,
} from "@nestjs/common";
import { AccesTokenGuard } from "src/auth/guards/access-token-guard";
import { CreateMyCompanyDto } from "./dto/create-my-company.dto";
import { IMyCompany } from "./interface/my-company.interface";
import { checkAdminRole } from "src/users/helpers/check-admin-role";
import { MyCompanyService } from "./my-company.service";
import { UpdateMyCompanyDto } from "./dto/update-my-company.dto";

@Controller("my-company")
export class MyCompanyController {
	constructor(private myCompanyService: MyCompanyService) {}

	@UseGuards(AccesTokenGuard)
	@Get()
	async find() {
		return await this.myCompanyService.findAll();
	}

	@UseGuards(AccesTokenGuard)
	@Post()
	async create(
		@Body() myCompanyDto: CreateMyCompanyDto,
		@Request() req
	): Promise<IMyCompany> {
		checkAdminRole(req.user["role"]);
		try {
			return await this.myCompanyService.create(myCompanyDto);
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@UseGuards(AccesTokenGuard)
	@Patch(":id")
	async update(
		@Param("id") companyId,
		@Body()
		companyUpdate: UpdateMyCompanyDto
	): Promise<IMyCompany> {
		const result = await this.myCompanyService.update(companyId, companyUpdate);
		if (!result) {
			throw new NotFoundException(`Nu pot gasi user-ul cu id-ul ${companyId}`);
		}
		return result;
	}
}
