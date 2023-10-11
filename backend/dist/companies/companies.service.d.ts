import { Model } from "mongoose";
import { IQueryParams } from "src/utils/shared-interface";
import { CreateCompanyDto, UpdateCompanyDto } from "./dto";
import { ICompany, ICompanyPagination } from "./interface/company.interface";
import { CompanyDocument } from "./schemas/companies.schema";
export declare class CompanyService {
    private companyModel;
    private ObjectId;
    constructor(companyModel: Model<CompanyDocument>);
    create(newCompany: CreateCompanyDto, query: IQueryParams): Promise<ICompanyPagination>;
    findAll(query: IQueryParams): Promise<ICompanyPagination>;
    findOne(query: object): Promise<ICompany>;
    updateOne(companyId: string, updateCompanyDto: UpdateCompanyDto, query: IQueryParams): Promise<ICompanyPagination>;
    toogleStatus(companyId: string, company: UpdateCompanyDto, query: IQueryParams): Promise<ICompanyPagination>;
    deleteOne(companyId: string, query: IQueryParams): Promise<ICompanyPagination>;
}
