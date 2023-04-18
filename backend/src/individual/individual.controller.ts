import {
	BadRequestException,
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
	Request,
} from "@nestjs/common";
import mongoose from "mongoose";
import { AccesTokenGuard } from "src/auth/guards/access-token-guard";
import { checkAdminRole } from "src/users/helpers/check-admin-role";
import { IQueryParams } from "src/utils/shared-interface";
import { CreateIndividualDto, UpdateIndividualDto } from "./dto";
import { IndividualService } from "./individual.service";
import {
	IIndividual,
	IIndividualPagination,
} from "./interface/inidivual.interface";

@Controller("individuals")
export class IndividualController {
	constructor(private readonly individualService: IndividualService) {}

	@UseGuards(AccesTokenGuard)
	@Get()
	async findAll(@Query() query: IQueryParams): Promise<IIndividualPagination> {
		return await this.individualService.findAll(query);
	}

	@UseGuards(AccesTokenGuard)
	@Get(":id")
	async findOne(@Param("id") individualId: string): Promise<IIndividual> {
		const ObjectId = mongoose.Types.ObjectId;
		const company = await this.individualService.findOne({
			_id: new ObjectId(`${individualId}`),
		});
		if (!company)
			throw new NotFoundException(
				`Nu am putut gasi persoana fizica cu id-ul ${individualId}`
			);
		return company;
	}

	@UseGuards(AccesTokenGuard)
	@Post("add")
	async add(
		@Query() query: IQueryParams,
		@Body() individual: CreateIndividualDto
	): Promise<IIndividualPagination> {
		try {
			return await this.individualService.create(individual, query);
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@UseGuards(AccesTokenGuard)
	@Post("add-and-return-individual")
	async addAndReturnIt(
		@Body() individual: CreateIndividualDto
	): Promise<IIndividual> {
		try {
			return await this.individualService.createAndReturnIt(individual);
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@UseGuards(AccesTokenGuard)
	@Patch(":id/edit-individual")
	async editIndividual(
		@Param("id") individualId: string,
		@Query() query: IQueryParams,
		@Body() updateIndividualDto: UpdateIndividualDto
	): Promise<IIndividualPagination> {
		const result = await this.individualService.updateOne(
			individualId,
			updateIndividualDto,
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
		@Param("id") individualId: string,
		@Query() query: IQueryParams,
		@Body() updateIndividualDto: UpdateIndividualDto
	): Promise<IIndividualPagination> {
		const result = await this.individualService.toogleStatus(
			individualId,
			updateIndividualDto,
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
		@Param("id") individualId: string,
		@Query() query: IQueryParams
	): Promise<IIndividualPagination> {
		checkAdminRole(req.user.role);
		const result = await this.individualService.deleteOne(individualId, query);
		if (!result)
			throw new NotFoundException(
				`Nu am putut sterge persoana fizica cu id-ul ${individualId}. Poate ca aceasta persoana fizica nu exista`
			);
		return result;
	}
}
