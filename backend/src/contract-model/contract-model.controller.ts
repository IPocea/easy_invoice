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
	Res,
} from "@nestjs/common";
import mongoose from "mongoose";
import { AccesTokenGuard } from "src/auth/guards/access-token-guard";
import { IQueryParams } from "src/utils/shared-interface";
import { ContractModelService } from "./contract-model.service";
import { CreateContractModelDto, UpdateContractModelDto } from "./dto";
import {
	IContractModel,
	IContractModelPdfContent,
	IContractModelResponse,
} from "./interface/contract-model.interface";
import * as puppeteer from "puppeteer";
import * as handlebars from "handlebars";
import * as fs from "fs";
import { join, resolve } from "path";

@Controller("contract-models")
export class ContractModelController {
	constructor(private contractModelService: ContractModelService) {}

	@UseGuards(AccesTokenGuard)
	@Get()
	async findAll(@Query() query: IQueryParams): Promise<IContractModel[]> {
		return await this.contractModelService.findAll(query ? query : {});
	}

	@UseGuards(AccesTokenGuard)
	@Get(":id")
	async findOne(@Param("id") contractModelId: string): Promise<IContractModel> {
		const ObjectId = mongoose.Types.ObjectId;
		const contractModel = await this.contractModelService.findOne({
			_id: new ObjectId(`${contractModelId}`),
		});
		if (!contractModel)
			throw new NotFoundException(
				`Nu am putut gasi modelul de contract cu id-ul ${contractModelId}`
			);
		return contractModel;
	}

	@UseGuards(AccesTokenGuard)
	@Post("add")
	async add(
		@Body() createContractModelDto: CreateContractModelDto
	): Promise<IContractModelResponse> {
		try {
			return await this.contractModelService.create(createContractModelDto);
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@UseGuards(AccesTokenGuard)
	@Patch(":id/edit-contract-model")
	async editCompany(
		@Param("id") contractModelId: string,
		@Query() query: IQueryParams,
		@Body() updateContractModelDto: UpdateContractModelDto
	): Promise<IContractModelResponse> {
		const result = await this.contractModelService.updateOne(
			contractModelId,
			updateContractModelDto,
			query ? query : {}
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
		@Param("id") contractModelId: string,
		@Query() query: IQueryParams
	): Promise<IContractModel[]> {
		const result = await this.contractModelService.deleteOne(
			contractModelId,
			query ? query : {}
		);
		if (!result)
			throw new NotFoundException(
				`Nu am putut sterge modelul de contract cu id-ul ${contractModelId}. Poate ca acest model de contract nu exista`
			);
		return result;
	}

	@UseGuards(AccesTokenGuard)
	@Post("show-contract-model/as-pdf")
	async showContractModelAsPdf(
		@Body() pdfContent: IContractModelPdfContent,
		@Res() res
	): Promise<void> {
		const templateFile = fs.readFileSync(
			join(
				resolve(process.cwd()),
				"src",
				"contract-model",
				"templates",
				"contract-model.hbs"
			),
			"utf8"
		);
		const template = handlebars.compile(templateFile);
		const data = {
			title: pdfContent.title ? pdfContent.title : "Model de contract",
			content: pdfContent.content,
		};

		const html = template(data);
		const browser = await puppeteer.launch();
		const page = await browser.newPage();

		await page.setContent(html);

		const pdfBuffer = await page.pdf({ format: "A4" });

		res.set({
			"Content-Type": "application/pdf",
			"Content-Disposition": `inline; filename=test.pdf`,
			"Content-Length": pdfBuffer.length,
		});

		res.send(pdfBuffer);

		await browser.close();
	}
}
