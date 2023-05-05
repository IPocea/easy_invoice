export const getCompIndivAggArray = (documentType: string): object[] => [
	{
		$lookup: {
			from: "invoices",
			localField: "_id",
			foreignField: documentType === "company" ? "companyId" : "individualId",
			as: "invoices",
		},
	},
	{
		$unwind: {
			path: "$invoices",
			preserveNullAndEmptyArrays: true,
		},
	},
	{
		$lookup: {
			from: "products",
			localField: "invoices._id",
			foreignField: "invoiceId",
			as: "products",
		},
	},
	{
		$lookup: {
			from: "payments",
			localField: "invoices._id",
			foreignField: "invoiceId",
			as: "payments",
		},
	},
	{
		$addFields: {
			totalSum: {
				$cond: {
					if: {
						$eq: ["$invoices.isCancelled", false],
					},
					then: {
						$divide: [
							{
								$sum: {
									$map: {
										input: "$products",
										as: "p",
										in: {
											$multiply: ["$$p.quantity", "$$p.unitPrice"],
										},
									},
								},
							},
							100,
						],
					},
					else: 0,
				},
			},
			totalPayment: {
				$cond: {
					if: {
						$eq: ["$invoices.isCancelled", false],
					},
					then: {
						$divide: [
							{
								$sum: {
									$map: {
										input: "$payments",
										as: "p",
										in: {
											$sum: "$$p.paymentAmount",
										},
									},
								},
							},
							100,
						],
					},
					else: 0,
				},
			},
		},
	},
	{
		$group:
			documentType === "company"
				? {
						_id: "$_id",
						name: {
							$first: "$name",
						},
						J: {
							$first: "$J",
						},
						CUI: {
							$first: "$CUI",
						},
						vatRate: {
							$first: "$vatRate",
						},
						headquarters: {
							$first: "$headquarters",
						},
						county: {
							$first: "$county",
						},
						bankAccount: {
							$first: "$bankAccount",
						},
						bank: {
							$first: "$bank",
						},
						email: {
							$first: "$email",
						},
						phone: {
							$first: "$phone",
						},
						isActivated: {
							$first: "$isActivated",
						},
						addedBy: {
							$first: "$addedBy",
						},
						editedBy: {
							$first: "$editedBy",
						},
						createdAt: {
							$first: "$createdAt",
						},
						updatedAt: {
							$first: "$updatedAt",
						},
						totalSum: {
							$sum: "$totalSum",
						},
						totalPayment: {
							$sum: "$totalPayment",
						},
				  }
				: {
						_id: "$_id",
						name: {
							$first: "$name",
						},
						series: {
							$first: "$series",
						},
						CNP: {
							$first: "$CNP",
						},
						headquarters: {
							$first: "$headquarters",
						},
						county: {
							$first: "$county",
						},
						bankAccount: {
							$first: "$bankAccount",
						},
						bank: {
							$first: "$bank",
						},
						email: {
							$first: "$email",
						},
						phone: {
							$first: "$phone",
						},
						isActivated: {
							$first: "$isActivated",
						},
						addedBy: {
							$first: "$addedBy",
						},
						editedBy: {
							$first: "$editedBy",
						},
						createdAt: {
							$first: "$createdAt",
						},
						updatedAt: {
							$first: "$updatedAt",
						},
						totalSum: {
							$sum: "$totalSum",
						},
						totalPayment: {
							$sum: "$totalPayment",
						},
				  },
	},
];
