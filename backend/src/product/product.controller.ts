import {
	Controller,
	Delete,
	Get,
	NotFoundException,
	Param,
	UseGuards,
} from "@nestjs/common";
import { Types } from "mongoose";
import { AccesTokenGuard } from "src/auth/guards/access-token-guard";
import { IMessageResponse } from "src/utils/shared-interface";
import { ProductService } from "./product.service";
import { IProduct } from "./interface/product.interface";

@Controller("products")
export class ProductController {
	private ObjectId = Types.ObjectId;
	constructor(private readonly productService: ProductService) {}

	@UseGuards(AccesTokenGuard)
	@Get(":invoiceId")
	async getAllOfInvoice(
		@Param("invoiceId") invoiceId: string
	): Promise<IProduct[]> {
		return await this.productService.findAllOfInvoice(
			new this.ObjectId(`${invoiceId}`)
		);
	}

	@UseGuards(AccesTokenGuard)
	@Delete(":productId")
	async deleteOne(
		@Param("productId") productId: string
	): Promise<IMessageResponse> {
		const result = await this.productService.deleteOne(
			new this.ObjectId(`${productId}`)
		);
		if (result) {
			return { message: `Produsul cu id-ul ${productId} a fost sters` };
		} else {
			throw new NotFoundException(
				`Nu am putut gasi produsul cu id-ul ${productId}. Poate ca produsul nu exista`
			);
		}
	}
}
