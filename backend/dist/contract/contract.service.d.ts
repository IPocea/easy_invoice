import { Model, Types } from "mongoose";
import { IMessageResponse, IQueryParams } from "src/utils/shared-interface";
import { CreateContractDto, UpdateContractDto } from "./dto";
import { IContract, IContractPagination } from "./interface/contract-interface";
import { ContractDocument } from "./schemas/contract.schema";
export declare class ContractService {
    private contractModel;
    private ObjectId;
    constructor(contractModel: Model<ContractDocument>);
    create(newContract: CreateContractDto): Promise<IContract>;
    findAll(query: IQueryParams): Promise<IContractPagination>;
    findOne(query: object): Promise<IContract>;
    findOneFullData(contractId: Types.ObjectId): Promise<IContract>;
    updateOne(contractId: Types.ObjectId, updateContractDto: UpdateContractDto): Promise<IContract>;
    updateOneByInvoiceId(invoiceId: Types.ObjectId, updateContractDto: UpdateContractDto): Promise<IContract>;
    deleteOne(contractId: Types.ObjectId): Promise<IMessageResponse>;
    deleteOneByInvoiceId(invoiceId: Types.ObjectId): Promise<IMessageResponse>;
}
