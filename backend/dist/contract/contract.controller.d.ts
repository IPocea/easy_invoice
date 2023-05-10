import { IQueryParams } from "src/utils/shared-interface";
import { ContractService } from "./contract.service";
import { IContract, IContractPagination } from "./interface/contract-interface";
export declare class ContractController {
    private readonly contractService;
    private ObjectId;
    constructor(contractService: ContractService);
    findAll(query: IQueryParams): Promise<IContractPagination>;
    findOne(contractId: string): Promise<IContract>;
    getContractAsPdf(res: any, contractId: string): Promise<void>;
}
