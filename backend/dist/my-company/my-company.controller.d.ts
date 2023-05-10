import { CreateMyCompanyDto } from "./dto/create-my-company.dto";
import { IMyCompany } from "./interface/my-company.interface";
import { MyCompanyService } from "./my-company.service";
import { UpdateMyCompanyDto } from "./dto/update-my-company.dto";
export declare class MyCompanyController {
    private myCompanyService;
    constructor(myCompanyService: MyCompanyService);
    find(): Promise<IMyCompany[]>;
    create(myCompanyDto: CreateMyCompanyDto, req: any): Promise<IMyCompany>;
    update(companyId: any, companyUpdate: UpdateMyCompanyDto): Promise<IMyCompany>;
}
