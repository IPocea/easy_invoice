import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { IMessageResponse } from "src/utils/shared-interface";
import { CreateProductDto, UpdateProductDto } from "./dto";
import { IProduct } from "./interface/product.interface";
import { Product, ProductDocument } from "./schemas/product.schema";

@Injectable()
export class ProductService {

	constructor(
		@InjectModel(Product.name)
		private productModel: Model<ProductDocument>
	) {}

	async findAllOfInvoice(invoiceId: Types.ObjectId): Promise<IProduct[]> {
		try {
			return await this.productModel.find({
				invoiceId: invoiceId,
			});
		} catch (error) {
			return null;
		}
	}

	async create(newProduct: CreateProductDto): Promise<IProduct> {
		try {
			const createdProduct = new this.productModel(newProduct);
			return await createdProduct.save();
		} catch (error) {
			return null;
		}
	}

	async createMany(newProducts: CreateProductDto[]): Promise<IMessageResponse> {
		try {
			const result = await this.productModel.insertMany(newProducts);
			if (result) {
				return { message: "Produsele au fost adaugate" };
			}
		} catch (error) {
			return null;
		}
	}

	async findOne(query: object): Promise<IProduct> {
		try {
			const product = await this.productModel.findOne(query);
			return product;
		} catch (error) {
			return null;
		}
	}

	async updateOne(
		productId: Types.ObjectId,
		updatedProductDto: UpdateProductDto
	): Promise<IMessageResponse> {
		try {
			await this.productModel.updateOne({ _id: productId }, updatedProductDto);
			return {
				message: "Produsul a fost actualizat",
			};
		} catch (error) {
			return null;
		}
	}

	async deleteOne(productId: Types.ObjectId): Promise<IMessageResponse> {
		try {
			await this.productModel.deleteOne({
				_id: productId,
			});
			return {
				message: `Produsul cu id-ul ${productId.toString()} a fost sters`,
			};
		} catch (error) {
			return null;
		}
	}

	async deleteManyByInvoiceId(
		invoiceId: Types.ObjectId
	): Promise<IMessageResponse> {
		try {
			const result = await this.productModel.deleteMany({
				invoiceId: invoiceId,
			});
			if (result) {
				return {
					message: `Produsele pentru factura cu id-ul ${invoiceId.toString()} au fost sterse`,
				};
			}
		} catch (error) {
			return null;
		}
	}

	async deleteMany(query: object): Promise<IMessageResponse> {
		try {
			const result = await this.productModel.deleteMany(query);
			if (result) {
				return {
					message: `Produsele pentru factura selectata au fost sterse`,
				};
			}
		} catch (error) {
			return null;
		}
	}
}
