import { Model, Types } from "mongoose";
import { IMessageResponse } from "src/utils/shared-interface";
import { CreatePaymentDto } from "./dto";
import { IPayment } from "./interface/payment.interface";
import { PaymentDocument } from "./schemas/payment.schema";
import { InvoiceDocument } from "src/invoice/schemas/invoice.schema";
import { IUser } from "src/users/interface/user.interface";
export declare class PaymentService {
    private paymentModel;
    private invoiceModel;
    private ObjectId;
    constructor(paymentModel: Model<PaymentDocument>, invoiceModel: Model<InvoiceDocument>);
    findAllOfInvoice(invoiceId: Types.ObjectId): Promise<IPayment[]>;
    create(newPayment: CreatePaymentDto): Promise<IPayment>;
    createAndUpdateInvoicePaymentStatus(newPayment: CreatePaymentDto, invoiceId: Types.ObjectId, user: IUser): Promise<IPayment>;
    findOne(paymentId: Types.ObjectId): Promise<IPayment>;
    deleteOne(paymentId: Types.ObjectId): Promise<IMessageResponse>;
    deleteAndUpdateInvoicePaymentStatus(paymentId: Types.ObjectId, invoiceId: Types.ObjectId, user: IUser): Promise<IMessageResponse>;
    deleteManyByInvoiceId(invoiceId: Types.ObjectId): Promise<IMessageResponse>;
    deleteMany(query: object): Promise<IMessageResponse>;
}
