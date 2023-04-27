import {
	Controller,
	Get,
	NotFoundException,
	Param,
	Query,
	Res,
	UseGuards,
} from "@nestjs/common";
import mongoose, { Types } from "mongoose";
import { AccesTokenGuard } from "src/auth/guards/access-token-guard";
import { IQueryParams } from "src/utils/shared-interface";
import { ContractService } from "./contract.service";
import { IContract, IContractPagination } from "./interface/contract-interface";
import * as puppeteer from "puppeteer";
import * as handlebars from "handlebars";
import * as fs from "fs";
import { join, resolve } from "path";

@Controller("contracts")
export class ContractController {
	private ObjectId = Types.ObjectId;
	constructor(private readonly contractService: ContractService) {}

	@UseGuards(AccesTokenGuard)
	@Get()
	async findAll(@Query() query: IQueryParams): Promise<IContractPagination> {
		return await this.contractService.findAll(query);
	}

	@UseGuards(AccesTokenGuard)
	@Get(":id")
	async findOne(@Param("id") contractId: string): Promise<IContract> {
		const ObjectId = mongoose.Types.ObjectId;
		const contract = await this.contractService.findOne({
			_id: new ObjectId(`${contractId}`),
		});
		if (!contract)
			throw new NotFoundException(
				`Nu am putut gasi contractul cu id-ul ${contractId}`
			);
		return contract;
	}

	@UseGuards(AccesTokenGuard)
	@Get(":id/get-pdf")
	async getContractAsPdf(
		@Res() res,
		@Param(":id") contractId: string
	): Promise<void> {
		const contract = await this.contractService.findOneFullData(
			new this.ObjectId(`${contractId}`)
		);
		if (!contract) {
			throw new NotFoundException(
				`Nu am putut gasi contractul cu id-ul ${contractId}`
			);
		}
		const templateFile = fs.readFileSync(
			join(
				resolve(process.cwd()),
				"src",
				"contract",
				"templates",
				"contract.hbs"
			),
			"utf8"
		);
		const template = handlebars.compile(templateFile);

		const html = template(contract);
		const browser = await puppeteer.launch();
		const page = await browser.newPage();

		await page.setContent(html);

		const pdfBuffer = await page.pdf({
			format: "A4",
		});

		res.set({
			"Content-Type": "application/pdf",
			"Content-Disposition": `inline; filename=test.pdf`,
			"Content-Length": pdfBuffer.length,
		});

		res.send(pdfBuffer);

		await browser.close();
	}
}
