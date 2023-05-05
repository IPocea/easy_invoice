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
	Req,
	Request,
	Res,
	UseGuards,
} from "@nestjs/common";
import { Types } from "mongoose";
import { AccesTokenGuard } from "src/auth/guards/access-token-guard";
import { HistoryService } from "src/history/history.service";
import { IMessageResponse, IQueryParams } from "src/utils/shared-interface";
import {
	CreateFullInvoiceDto,
	UpdateFullInvoiceDto,
	UpdateInvoiceDto,
} from "./dto";
import { IInvoice, IInvoicePagination } from "./interface/invoice.interface";
import { InvoiceService } from "./invoice.service";
import * as puppeteer from "puppeteer";
import * as handlebars from "handlebars";
import * as fs from "fs";
import { join, resolve } from "path";
import {
	getDateFormatHelper,
	getIndexPlusOneHelper,
	getIsCancelledHelper,
	getNoticeNumberHelper,
	getTotalOfProductHelper,
	getTotalVatHelper,
	getVatOfProductHelper,
} from "./handlebars-helpers/helpers";
import { checkAdminRole } from "src/users/helpers/check-admin-role";

@Controller("invoices")
export class InvoiceController {
	private ObjectId = Types.ObjectId;
	constructor(
		private readonly invoiceService: InvoiceService,
		private readonly historyService: HistoryService
	) {}

	@UseGuards(AccesTokenGuard)
	@Get()
	async findAll(@Query() query: IQueryParams): Promise<IInvoicePagination> {
		return await this.invoiceService.findAllFullInvoice(query);
	}

	@UseGuards(AccesTokenGuard)
	@Get(":invoiceId")
	async findOneFullData(
		@Param("invoiceId") invoiceId: string
	): Promise<IInvoice> {
		try {
			const invoice = await this.invoiceService.findOneFullData(
				new this.ObjectId(`${invoiceId}`)
			);
			return invoice;
		} catch (error) {
			throw new NotFoundException(
				`Nu am putut gasi factura cu id-ul ${invoiceId}`
			);
		}
	}

	@UseGuards(AccesTokenGuard)
	@Post("add")
	async add(
		@Request() req,
		@Body() fullInvoice: CreateFullInvoiceDto
	): Promise<IInvoice> {
		try {
			const result = await this.invoiceService.create(fullInvoice);
			if (result) {
				await this.historyService.create({
					actionDescription: "Factura a fost adaugata",
					addedBy: req.user.firstName + " " + req.user.lastName,
					invoiceId: result._id,
				});
				return result;
			}
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	@UseGuards(AccesTokenGuard)
	@Patch(":invoiceId/edit-full-invoice")
	async editFullInvoice(
		@Request() req,
		@Param("invoiceId") invoiceId: string,
		@Body() updateFullInvoice: UpdateFullInvoiceDto
	): Promise<IInvoice> {
		const result = await this.invoiceService.updateFullInvoice(
			updateFullInvoice,
			new this.ObjectId(`${invoiceId}`)
		);
		if (!result) {
			throw new BadRequestException();
		}
		await this.historyService.create({
			actionDescription: "Factura a fost modificata",
			addedBy: req.user.firstName + " " + req.user.lastName,
			invoiceId: result._id,
		});
		return result;
	}

	@UseGuards(AccesTokenGuard)
	@Patch(":invoiceId/toggle-status")
	async toggleInvoiceStatus(
		@Param("invoiceId") invoiceId: string,
		@Body() updateInvoiceDto: UpdateInvoiceDto
	) {
		const invoiceObjectId = new this.ObjectId(`${invoiceId}`);
		const userName = updateInvoiceDto.editedBy;
		const result = await this.invoiceService.updateOne(
			invoiceObjectId,
			updateInvoiceDto
		);
		if (result) {
			const actionDescription: string = updateInvoiceDto.isCancelled
				? "Factura a fost anulata"
				: "Factura a fost reactivata";
			await this.historyService.create({
				actionDescription: actionDescription,
				addedBy: userName,
				invoiceId: invoiceObjectId,
			});
			return await this.invoiceService.findOneFullData(invoiceObjectId);
		} else {
			throw new BadRequestException(
				"O eroare neprevazuta a intervenit. Te rugam sa faci refresh la pagina si sa incerci din nou"
			);
		}
	}

	@UseGuards(AccesTokenGuard)
	@Delete(":invoiceId/delete-from-table")
	async deleteOneFromTable(
		@Param("invoiceId") invoiceIdString: string,
		@Query() query: IQueryParams,
		@Req() req
	): Promise<IInvoicePagination> {
		checkAdminRole(req.user.role);
		const invoiceId = new this.ObjectId(`${invoiceIdString}`);
		const result = await this.invoiceService.deleteFullInvoice(invoiceId);
		if (!result)
			throw new NotFoundException(
				`Nu am putut sterge factura cu id-ul ${invoiceId.toString()}. Poate ca aceasta persoana factura nu exista`
			);
		await this.historyService.deleteManyByInvoiceId(invoiceId);
		return await this.invoiceService.findAllFullInvoice(query);
	}

	@UseGuards(AccesTokenGuard)
	@Delete(":invoiceId/delete-from-invoice")
	async deleteOne(
		@Param("invoiceId") invoiceIdString: string,
		@Req() req
	): Promise<IMessageResponse> {
		checkAdminRole(req.user.role);
		const invoiceId = new this.ObjectId(`${invoiceIdString}`);
		const result = await this.invoiceService.deleteFullInvoice(invoiceId);
		if (!result)
			throw new NotFoundException(
				`Nu am putut sterge factura cu id-ul ${invoiceId.toString()}. Poate ca aceasta persoana factura nu exista`
			);
		await this.historyService.deleteManyByInvoiceId(invoiceId);
		return result;
	}

	@UseGuards(AccesTokenGuard)
	@Get(":invoiceId/generate-pdf")
	async generatePdf(@Param("invoiceId") invoiceId: string, @Res() res) {
		const invoice = await this.invoiceService.findOneFullData(
			new this.ObjectId(`${invoiceId}`)
		);
		if (!invoice) {
			throw new NotFoundException(`Nu exista o factura cu id-ul ${invoiceId}`);
		}
		const templateFile = fs.readFileSync(
			join(
				resolve(process.cwd()),
				"src",
				"invoice",
				"templates",
				"invoice.hbs"
			),
			"utf8"
		);
		handlebars.registerHelper("notice-number", getNoticeNumberHelper());
		handlebars.registerHelper("is-cancelled", getIsCancelledHelper());
		handlebars.registerHelper("date-format", getDateFormatHelper());
		handlebars.registerHelper("index-plus-one", getIndexPlusOneHelper());
		handlebars.registerHelper("total-of-product", getTotalOfProductHelper());
		handlebars.registerHelper("vat-of-product", getVatOfProductHelper());
		handlebars.registerHelper("total-vat", getTotalVatHelper());
		const template = handlebars.compile(templateFile);
		const html = template(invoice);
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
