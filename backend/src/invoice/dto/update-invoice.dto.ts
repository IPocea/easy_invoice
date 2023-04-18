import { Types } from "mongoose";
import { UpdateBuyerDto } from "src/buyer/dto";
import { UpdateContractDto } from "src/contract/dto";
import { UpdateProductDto } from "src/product/dto";
import { UpdateSellerDto } from "src/seller/dto";

export class UpdateFullInvoiceDto {
	invoice: UpdateInvoiceDto;
	buyer: UpdateBuyerDto;
	seller: UpdateSellerDto;
	contract: UpdateContractDto;
	products: UpdateProductDto[];
}

export class UpdateInvoiceDto {
	_id?: Types.ObjectId;
	typeOfInvoice?: string;
	series?: string;
	number?: string;
	date?: Date;
	numberOfAccompanyingNotice?: string;
	isCancelled?: boolean;
	cancellationNotices?: string;
	borderColor?: string;
	paymentStatus?: boolean;
	companyId?: Types.ObjectId;
	individualId?: Types.ObjectId;
	addedBy?: string;
	editedBy?: string;
	createdAt?: Date;
}
