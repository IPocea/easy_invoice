import { IHistoryAction } from "./interface/history.interface";
import { HistoryService } from "./history.service";
export declare class HistoryController {
    private readonly historyService;
    private ObjectId;
    constructor(historyService: HistoryService);
    getAllOfInvoice(invoiceId: string): Promise<IHistoryAction[]>;
}
