import { Types } from "mongoose";

export const contractsSingleAggrArray = (contractId: Types.ObjectId) => [
	{
		$match: {
			_id: contractId,
		},
	},
	{
		$lookup: {
			from: "invoices",
			localField: "invoiceId",
			foreignField: "_id",
			as: "invoice",
			pipeline: [
				{
					$lookup: {
						from: "companies",
						localField: "companyId",
						foreignField: "_id",
						as: "company",
					},
				},
				{
					$lookup: {
						from: "individuals",
						localField: "individualId",
						foreignField: "_id",
						as: "individual",
					},
				},
				{
					$lookup: {
						from: "products",
						localField: "_id",
						foreignField: "invoiceId",
						as: "products",
					},
				},
				{
					$addFields: {
						totalCost: {
							$divide: [
								{
									$sum: {
										$map: {
											input: "$products",
											in: {
												$multiply: ["$$this.quantity", "$$this.unitPrice"],
											},
										},
									},
								},
								100,
							],
						},
					},
				},
			],
		},
	},
	{
		$project: {
			"invoice.products": 0,
		},
	},
];
