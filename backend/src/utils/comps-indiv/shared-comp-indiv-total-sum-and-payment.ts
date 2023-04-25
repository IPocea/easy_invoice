export const getCompIndivAggArray = (documentType: string): object[] => [
	{
		$lookup: {
			from: "invoices",
			localField: "_id",
			foreignField: documentType === "company" ? "companyId" : "individualId",
			as: "paymentData",
			pipeline: [
				{
					$lookup: {
						from: "products",
						localField: "_id",
						foreignField: "invoiceId",
						as: "products",
					},
				},
				{
					$unwind: {
						path: "$products",
						preserveNullAndEmptyArrays: true,
					},
				},
				{
					$match: {
						isCancelled: false,
					},
				},
				{
					$group: {
						_id: "$_id",
						totalSum: {
							$sum: {
								$multiply: ["$products.quantity", "$products.unitPrice"],
							},
						},
						invoiceIds: {
							$addToSet: "$_id",
						},
					},
				},
				{
					$lookup: {
						from: "payments",
						localField: "_id",
						foreignField: "invoiceId",
						as: "payments",
					},
				},
				{
					$unwind: {
						path: "$payments",
						preserveNullAndEmptyArrays: true,
					},
				},
				{
					$group: {
						_id: "$_id",
						totalSum: {
							$first: "$totalSum",
						},
						totalPayment: {
							$sum: "$payments.paymentAmount",
						},
					},
				},
				{
					$project: {
						_id: 0,
						totalSum: {
							$divide: ["$totalSum", 100],
						},
						totalPayment: {
							$divide: ["$totalPayment", 100],
						},
					},
				},
			],
		},
	},
];
