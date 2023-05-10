import { IQueryParams } from "src/utils/shared-interface";
import { ContractModelService } from "./contract-model.service";
import { CreateContractModelDto, UpdateContractModelDto } from "./dto";
import { IContractModel, IContractModelPdfContent, IContractModelResponse } from "./interface/contract-model.interface";
export declare class ContractModelController {
    private contractModelService;
    constructor(contractModelService: ContractModelService);
    findAll(query: IQueryParams): Promise<IContractModel[]>;
    findOne(contractModelId: string): Promise<IContractModel>;
    add(createContractModelDto: CreateContractModelDto): Promise<IContractModelResponse>;
    editCompany(contractModelId: string, query: IQueryParams, updateContractModelDto: UpdateContractModelDto): Promise<IContractModelResponse>;
    deleteOne(req: any, contractModelId: string, query: IQueryParams): Promise<IContractModel[]>;
    showContractModelAsPdf(pdfContent: IContractModelPdfContent, res: any): Promise<void>;
}
