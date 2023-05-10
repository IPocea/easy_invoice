import { Model } from "mongoose";
import { IQueryParams } from "src/utils/shared-interface";
import { CreateIndividualDto, UpdateIndividualDto } from "./dto";
import { IIndividual, IIndividualPagination } from "./interface/inidivual.interface";
import { Individual } from "./schemas/individual.schema";
export declare class IndividualService {
    private individualModel;
    private ObjectId;
    constructor(individualModel: Model<Individual>);
    create(newIndividual: CreateIndividualDto, query: IQueryParams): Promise<IIndividualPagination>;
    createAndReturnIt(newIndividual: CreateIndividualDto): Promise<Individual>;
    findAll(query: IQueryParams): Promise<IIndividualPagination>;
    findAllActives(query: IQueryParams): Promise<IIndividualPagination>;
    findOne(query: object): Promise<IIndividual>;
    updateOne(individualId: string, updateIndividualDto: UpdateIndividualDto, query: IQueryParams): Promise<IIndividualPagination>;
    toogleStatus(individualId: string, individual: UpdateIndividualDto, query: IQueryParams): Promise<IIndividualPagination>;
    deleteOne(individualId: string, query: IQueryParams): Promise<IIndividualPagination>;
}
