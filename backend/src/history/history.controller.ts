import {
	BadRequestException,
	Controller,
	Get,
	Param,
	UseGuards,
} from "@nestjs/common";
import { AccesTokenGuard } from "src/auth/guards/access-token-guard";
import { IHistoryAction } from "./interface/history.interface";
import { HistoryService } from "./history.service";
import { Types } from "mongoose";

@Controller("histories")
export class HistoryController {
	private ObjectId = Types.ObjectId;
	constructor(private readonly historyService: HistoryService) {}

	@UseGuards(AccesTokenGuard)
	@Get(":invoiceId")
	async getAllOfInvoice(
		@Param("invoiceId") invoiceId: string
	): Promise<IHistoryAction[]> {
		if (!this.ObjectId.isValid(invoiceId)) {
			throw new BadRequestException("Id-ul introdus nu este valid");
		}
		const result = await this.historyService.findAllOfInvoice(
			new this.ObjectId(`${invoiceId}`)
		);
		if (result) {
			return result;
		} else {
			throw new BadRequestException(
				"O eroare neasteptata a avut loc. Te rugam sa inceci din nou"
			);
		}
	}
}
