export const contractsAggregationArray: object[] = [
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
			],
		},
	},
];
