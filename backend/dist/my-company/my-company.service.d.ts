import { Model } from "mongoose";
import { CreateMyCompanyDto } from "./dto/create-my-company.dto";
import { UpdateMyCompanyDto } from "./dto/update-my-company.dto";
import { IMyCompany } from "./interface/my-company.interface";
import { MyCompanyDocument } from "./schemas/my-company.schema";
export declare class MyCompanyService {
    private myCompanyModel;
    constructor(myCompanyModel: Model<MyCompanyDocument>);
    create(newCompany: CreateMyCompanyDto): Promise<IMyCompany>;
    findAll(): Promise<IMyCompany[]>;
    findOne(query: object): Promise<IMyCompany>;
    update(myCompanyId: string, myCompanyUpdate: UpdateMyCompanyDto): Promise<IMyCompany>;
}
