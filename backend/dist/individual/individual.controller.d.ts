import { IQueryParams } from "src/utils/shared-interface";
import { CreateIndividualDto, UpdateIndividualDto } from "./dto";
import { IndividualService } from "./individual.service";
import { IIndividual, IIndividualPagination } from "./interface/inidivual.interface";
export declare class IndividualController {
    private readonly individualService;
    constructor(individualService: IndividualService);
    findAll(query: IQueryParams): Promise<IIndividualPagination>;
    findAllActives(query: IQueryParams): Promise<IIndividualPagination>;
    findOne(individualId: string): Promise<IIndividual>;
    add(query: IQueryParams, individual: CreateIndividualDto): Promise<IIndividualPagination>;
    addAndReturnIt(individual: CreateIndividualDto): Promise<IIndividual>;
    editIndividual(individualId: string, query: IQueryParams, updateIndividualDto: UpdateIndividualDto): Promise<IIndividualPagination>;
    updateStatus(individualId: string, query: IQueryParams, updateIndividualDto: UpdateIndividualDto): Promise<IIndividualPagination>;
    deleteOne(req: any, individualId: string, query: IQueryParams): Promise<IIndividualPagination>;
}
