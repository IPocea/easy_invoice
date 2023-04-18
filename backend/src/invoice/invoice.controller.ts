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
	Request,
	UseGuards,
} from "@nestjs/common";
import { Types } from "mongoose";
import { AccesTokenGuard } from "src/auth/guards/access-token-guard";
import { HistoryService } from "src/history/history.service";
import { IMessageResponse, IQueryParams } from "src/utils/shared-interface";
import { CreateFullInvoiceDto, UpdateFullInvoiceDto } from "./dto";
import { IInvoice, IInvoicePagination } from "./interface/invoice.interface";
import { InvoiceService } from "./invoice.service";

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
	@Get(":id")
	async findOneFullData(@Param("id") invoiceId: string): Promise<IInvoice> {
		const invoice = await this.invoiceService.findOneFullData(
			new this.ObjectId(`${invoiceId}`)
		);
		return invoice;
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
	@Patch("edit-full-invoice")
	async editFullInvoice(
		@Request() req,
		@Body() updateFullInvoice: UpdateFullInvoiceDto
	): Promise<IInvoice> {
		const result = await this.invoiceService.updateFullInvoice(
			updateFullInvoice
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
	@Delete("from-table/:invoiceId/:buyerId/:sellerId/:contractId")
	async deleteOneFromTable(
		@Param("invoiceId") invoiceIdString: string,
		@Param("buyerId") buyerIdString: string,
		@Param("sellerId") sellerIdString: string,
		@Param("contractId") contractIdString: string,
		@Query() query: IQueryParams
	): Promise<IInvoicePagination> {
		const invoiceId = new this.ObjectId(`${invoiceIdString}`);
		const buyerId = new this.ObjectId(`${buyerIdString}`);
		const sellerId = new this.ObjectId(`${sellerIdString}`);
		const contractId = new this.ObjectId(`${contractIdString}`);
		const result = await this.invoiceService.deleteFullInvoice(
			invoiceId,
			buyerId,
			sellerId,
			contractId
		);
		if (!result)
			throw new NotFoundException(
				`Nu am putut sterge factura cu id-ul ${invoiceId.toString()}. Poate ca aceasta persoana factura nu exista`
			);
		await this.historyService.deleteManyByInvoiceId(invoiceId);
		return await this.invoiceService.findAllFullInvoice(query);
	}

	@UseGuards(AccesTokenGuard)
	@Delete("from-invoice/:invoiceId/:buyerId/:sellerId/:contractId")
	async deleteOne(
		@Param("invoiceId") invoiceIdString: string,
		@Param("buyerId") buyerIdString: string,
		@Param("sellerId") sellerIdString: string,
		@Param("contractId") contractIdString: string
	): Promise<IMessageResponse> {
		const invoiceId = new this.ObjectId(`${invoiceIdString}`);
		const buyerId = new this.ObjectId(`${buyerIdString}`);
		const sellerId = new this.ObjectId(`${sellerIdString}`);
		const contractId = new this.ObjectId(`${contractIdString}`);
		const result = await this.invoiceService.deleteFullInvoice(
			invoiceId,
			buyerId,
			sellerId,
			contractId
		);
		if (!result)
			throw new NotFoundException(
				`Nu am putut sterge factura cu id-ul ${invoiceId.toString()}. Poate ca aceasta persoana factura nu exista`
			);
		await this.historyService.deleteManyByInvoiceId(invoiceId);
		return result;
	}
}
