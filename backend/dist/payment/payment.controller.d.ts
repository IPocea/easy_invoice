import { PaymentService } from "./payment.service";
import { IPayment } from "./interface/payment.interface";
import { CreatePaymentDto } from "./dto";
import { HistoryService } from "src/history/history.service";
export declare class PaymentController {
    private readonly paymentService;
    private readonly historyService;
    private ObjectId;
    constructor(paymentService: PaymentService, historyService: HistoryService);
    getAllOfInvoice(invoiceId: string): Promise<IPayment[]>;
    addPayment(paymentDto: CreatePaymentDto, req: any): Promise<IPayment[]>;
    deletePayment(paymentId: string, invoiceId: string, req: any): Promise<IPayment[]>;
}
