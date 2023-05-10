import { Model, Types } from "mongoose";
import { IMessageResponse } from "src/utils/shared-interface";
import { CreateHistoryActionDto } from "./dto";
import { IHistoryAction } from "./interface/history.interface";
import { HistoryDocument } from "./schemas/history-model.schema";
export declare class HistoryService {
    private historyModel;
    constructor(historyModel: Model<HistoryDocument>);
    create(newAction: CreateHistoryActionDto): Promise<IHistoryAction>;
    findOne(query: object): Promise<IHistoryAction>;
    findAllOfInvoice(invoiceId: Types.ObjectId): Promise<IHistoryAction[]>;
    deleteManyByInvoiceId(invoiceId: Types.ObjectId): Promise<IMessageResponse>;
    deleteMany(query: object): Promise<IMessageResponse>;
}
