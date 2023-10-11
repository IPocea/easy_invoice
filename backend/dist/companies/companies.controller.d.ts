import { IQueryParams } from "src/utils/shared-interface";
import { CompanyService } from "./company.service";
import { CreateCompanyDto, UpdateCompanyDto } from "./dto";
import { ICompany, ICompanyPagination } from "./interface/company.interface";
export declare class CompanyController {
    private readonly companyService;
    constructor(companyService: CompanyService);
    findAll(query: IQueryParams): Promise<ICompanyPagination>;
    findOne(companyId: string): Promise<ICompany>;
    add(query: IQueryParams, company: CreateCompanyDto): Promise<ICompanyPagination>;
    editCompany(companyId: string, query: IQueryParams, updateCompanyDto: UpdateCompanyDto): Promise<ICompanyPagination>;
    updateStatus(companyId: string, query: IQueryParams, updateCompanyDto: UpdateCompanyDto): Promise<ICompanyPagination>;
    deleteOne(companyId: string, query: IQueryParams): Promise<ICompanyPagination>;
}
