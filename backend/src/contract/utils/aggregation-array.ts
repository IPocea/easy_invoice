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
						from: "buyers",
						localField: "_id",
						foreignField: "invoiceId",
						as: "buyer",
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
			_id: 1,
			number: 1,
			createdAt: 1,
			addedBy: 1,
			invoice: {
				$arrayElemAt: ["$invoice", 0],
			},
		},
	},
	{
		$project: {
			_id: 1,
			number: 1,
			createdAt: 1,
			addedBy: 1,
			invoice: {
				$mergeObjects: [
					"$invoice",
					{
						buyer: {
							$arrayElemAt: ["$invoice.buyer", 0],
						},
					},
				],
			},
		},
	},
	{
		$project: {
			_id: 1,
			number: 1,
			createdAt: 1,
			addedBy: 1,
			invoice: {
				_id: 1,
				date: 1,
				number: 1,
				buyer: 1,		
				totalCost: 1,
			}
		},
	},
];
