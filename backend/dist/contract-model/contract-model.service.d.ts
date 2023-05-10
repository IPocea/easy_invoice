import { Model } from "mongoose";
import { IQueryParams } from "src/utils/shared-interface";
import { CreateContractModelDto, UpdateContractModelDto } from "./dto";
import { IContractModel, IContractModelResponse } from "./interface/contract-model.interface";
import { ContractModelDocument } from "./schemas/contract-model.schema";
export declare class ContractModelService {
    private contractModel;
    private ObjectId;
    constructor(contractModel: Model<ContractModelDocument>);
    findAll(query?: IQueryParams): Promise<IContractModel[]>;
    findOne(query: object): Promise<IContractModel>;
    create(createContractModelDto: CreateContractModelDto): Promise<IContractModelResponse>;
    updateOne(contractModelId: string, updateContractModelDto: UpdateContractModelDto, query: IQueryParams): Promise<IContractModelResponse>;
    deleteOne(contractModelId: string, query: IQueryParams): Promise<IContractModel[]>;
}
