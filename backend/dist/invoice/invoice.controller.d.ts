import { HistoryService } from "src/history/history.service";
import { IMessageResponse, IQueryParams } from "src/utils/shared-interface";
import { CreateFullInvoiceDto, UpdateFullInvoiceDto, UpdateInvoiceDto } from "./dto";
import { IInvoice, IInvoicePagination } from "./interface/invoice.interface";
import { InvoiceService } from "./invoice.service";
export declare class InvoiceController {
    private readonly invoiceService;
    private readonly historyService;
    private ObjectId;
    constructor(invoiceService: InvoiceService, historyService: HistoryService);
    findAll(query: IQueryParams): Promise<IInvoicePagination>;
    findOneFullData(invoiceId: string): Promise<IInvoice>;
    add(req: any, fullInvoice: CreateFullInvoiceDto): Promise<IInvoice>;
    editFullInvoice(req: any, invoiceId: string, updateFullInvoice: UpdateFullInvoiceDto): Promise<IInvoice>;
    toggleInvoiceStatus(invoiceId: string, updateInvoiceDto: UpdateInvoiceDto): Promise<IInvoice>;
    deleteOneFromTable(invoiceIdString: string, query: IQueryParams, req: any): Promise<IInvoicePagination>;
    deleteOne(invoiceIdString: string, req: any): Promise<IMessageResponse>;
    generatePdf(invoiceId: string, res: any): Promise<void>;
}
