import { BadRequestException, Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { BuyerService } from "src/buyer/buyer.service";
import { CreateProductDto } from "src/product/dto";
import { ProductService } from "src/product/product.service";
import { SellerService } from "src/seller/seller.service";
import { IMessageResponse, IQueryParams } from "src/utils/shared-interface";
import {
	CreateFullInvoiceDto,
	UpdateFullInvoiceDto,
	UpdateInvoiceDto,
} from "./dto";
import { IInvoice } from "./interface/invoice.interface";
import { Invoice } from "./schemas/invoice.schema";
import { getFullInvoicePagination } from "./utils/invoice-pagination";
import { getSglInvoiceAggrArray } from "./utils/single-invoice-aggregation-array";
import { ContractService } from "src/contract/contract.service";
import { multiply } from "src/utils/shared-operators";
import { PaymentService } from "src/payment/payment.service";

@Injectable()
export class InvoiceService {
	private ObjectId = Types.ObjectId;
	constructor(
		@InjectModel(Invoice.name) private invoiceModel: Model<Invoice>,
		private readonly buyerService: BuyerService,
		private readonly sellerService: SellerService,
		private readonly contractService: ContractService,
		private readonly productService: ProductService,
		private readonly paymentService: PaymentService
	) {}

	async findAllFullInvoice(query: IQueryParams) {
		return await getFullInvoicePagination(this.invoiceModel, query);
	}

	// used so far only in middleware to check for duplicate number of invoice
	async findOne(query: Object): Promise<IInvoice> {
		try {
			return await this.invoiceModel.findOne(query);
		} catch (error) {
			return null;
		}
	}

	async findOneFullData(invoiceId: Types.ObjectId): Promise<IInvoice> {
		try {
			const aggArray = getSglInvoiceAggrArray(invoiceId);
			// you need to save the result first and then use result[0] otherwhise
			// [0] it will not wait for await and go undefined
			const result = await this.invoiceModel.aggregate(aggArray);
			return result[0] ? result[0] : null;
		} catch (error) {
			return null;
		}
	}

	async create(newFullInvoice: CreateFullInvoiceDto): Promise<IInvoice> {
		try {
			if (newFullInvoice.invoice.companyId) {
				newFullInvoice.invoice.companyId = new this.ObjectId(
					`${newFullInvoice.invoice.companyId}`
				);
			} else {
				newFullInvoice.invoice.individualId = new this.ObjectId(
					`${newFullInvoice.invoice.individualId}`
				);
			}
			const invoice = new this.invoiceModel(newFullInvoice.invoice);
			await invoice.save();
			const buyerDto = newFullInvoice.buyer;
			buyerDto.invoiceId = invoice._id;
			const buyer = await this.buyerService.create(buyerDto);
			const sellerDto = newFullInvoice.seller;
			sellerDto.invoiceId = invoice._id;
			delete sellerDto._id;
			const seller = await this.sellerService.create(sellerDto);
			const contractDto = newFullInvoice.contract;
			contractDto.invoiceId = invoice._id;
			const contract = await this.contractService.create(contractDto);
			if (buyer && seller && contract) {
				for (const productDto of newFullInvoice.products) {
					productDto.invoiceId = invoice._id;
					productDto.unitPrice = multiply(productDto.unitPrice, 100);
					await this.productService.create(productDto);
				}
				return await this.findOneFullData(invoice._id);
			} else {
				throw new BadRequestException(
					"O eroare neprevazuta a avut loc. Te rugam sa faci refresh la pagina si sa reincerci"
				);
			}
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	async updateFullInvoice(
		updateFullInvoice: UpdateFullInvoiceDto,
		invoiceId: Types.ObjectId
	): Promise<IInvoice> {
		try {
			updateFullInvoice.buyer.invoiceId = invoiceId;
			if (updateFullInvoice.invoice.companyId) {
				updateFullInvoice.invoice.companyId = new this.ObjectId(
					`${updateFullInvoice.invoice.companyId}`
				);
			} else {
				updateFullInvoice.invoice.individualId = new this.ObjectId(
					`${updateFullInvoice.invoice.individualId}`
				);
			}
			await this.buyerService.updateOneByInvoiceId(
				invoiceId,
				updateFullInvoice.buyer
			);

			await this.sellerService.updateOneByInvoiceId(
				invoiceId,
				updateFullInvoice.seller
			);

			await this.contractService.updateOneByInvoiceId(
				invoiceId,
				updateFullInvoice.contract
			);

			for (const product of updateFullInvoice.products) {
				product.unitPrice = multiply(product.unitPrice, 100);
				if (product._id) {
					product._id = new this.ObjectId(`${product._id}`);
					await this.productService.updateOne(product._id, product);
				} else {
					const newProduct: CreateProductDto = {
						name: product.name,
						quantity: product.quantity,
						unitPrice: product.unitPrice,
						VAT: product.VAT,
						invoiceId: invoiceId,
						UM: product.UM,
					};
					await this.productService.create(newProduct);
				}
			}

			await this.updateOne(invoiceId, updateFullInvoice.invoice);
			return await this.findOneFullData(invoiceId);
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	async updateOne(
		invoiceId: Types.ObjectId,
		updateInvoiceDto: UpdateInvoiceDto
	): Promise<IMessageResponse> {
		try {
			await this.invoiceModel.updateOne({ _id: invoiceId }, updateInvoiceDto);
			return { message: "Factura a fost actualizata cu succes" };
		} catch (error) {
			return null;
		}
	}

	async deleteFullInvoice(
		invoiceId: Types.ObjectId
	): Promise<IMessageResponse> {
		try {
			await this.productService.deleteManyByInvoiceId(invoiceId);
			await this.buyerService.deleteOneByInvoiceId(invoiceId);
			await this.sellerService.deleteOneByInvoiceId(invoiceId);
			await this.contractService.deleteOneByInvoiceId(invoiceId);
			await this.paymentService.deleteManyByInvoiceId(invoiceId);
			const result = await this.deleteOne(invoiceId);
			if (result) {
				return result;
			} else {
				throw new BadRequestException(
					"O eroare neasteptata a intervenit. Te rugam sa faci refresh la pagina si sa incerci din nou"
				);
			}
		} catch (error) {
			throw new BadRequestException(error.message);
		}
	}

	async deleteOne(invoiceId: Types.ObjectId): Promise<IMessageResponse> {
		try {
			const result = await this.invoiceModel.deleteOne({
				_id: invoiceId,
			});
			if (result) {
				return { message: "Factura a fost stearsa cu succes" };
			} else {
				return null;
			}
		} catch (error) {
			return null;
		}
	}
}
