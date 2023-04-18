import {
	Controller,
	Get,
	NotFoundException,
	Param,
	Query,
	UseGuards,
} from "@nestjs/common";
import mongoose from "mongoose";
import { AccesTokenGuard } from "src/auth/guards/access-token-guard";
import { IQueryParams } from "src/utils/shared-interface";
import { ContractService } from "./contract.service";
import { IContract, IContractPagination } from "./interface/contract-interface";

@Controller("contracts")
export class ContractController {
	constructor(private readonly contractService: ContractService) {}

	@UseGuards(AccesTokenGuard)
	@Get()
	async findAll(@Query() query: IQueryParams): Promise<IContractPagination> {
		return await this.contractService.findAll(query);
	}

	@UseGuards(AccesTokenGuard)
	@Get(":id")
	async findOne(@Param("id") contractId: string): Promise<IContract> {
		const ObjectId = mongoose.Types.ObjectId;
		const contract = await this.contractService.findOne({
			_id: new ObjectId(`${contractId}`),
		});
		if (!contract)
			throw new NotFoundException(
				`Nu am putut gasi contractul cu id-ul ${contractId}`
			);
		return contract;
	}

}
