import { Types } from "mongoose";

export const getSglInvoiceAggrArray = (invoiceId: Types.ObjectId) => {
	return [
		{
			$match: {
				_id: invoiceId,
			},
		},
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
				from: "sellers",
				localField: "_id",
				foreignField: "invoiceId",
				as: "seller",
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
			$lookup: {
				from: "payments",
				localField: "_id",
				foreignField: "invoiceId",
				as: "payments",
			},
		},
		{
			$lookup: {
				from: "contracts",
				localField: "_id",
				foreignField: "invoiceId",
				as: "contract",
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
				totalPayments: {
					$divide: [
						{
							$sum: "$payments.paymentAmount",
						},
						100,
					],
				},
			},
		},
		{
			$project: {
				_id: 1,
				buyer: {
					$arrayElemAt: ["$buyer", 0],
				},
				seller: {
					$arrayElemAt: ["$seller", 0],
				},
				contract: {
					$arrayElemAt: ["$contract", 0],
				},
				payments: {
					$map: {
						input: "$payments",
						in: {
							_id: "$$this._id",
							invoiceId: "$$this.invoiceId",
							addedBy: "$$this.addedBy",
							editedBy: "$$this.editedBy",
							createdAt: "$$this.createdAt",
							updatedAt: "$$this.updatedAt",
							paymentAmount: {
								$divide: ["$$this.paymentAmount", 100],
							},
						},
					},
				},
				products: {
					$map: {
						input: "$products",
						in: {
							_id: "$$this._id",
							name: "$$this.name",
							quantity: "$$this.quantity",
							unitPrice: {
								$divide: ["$$this.unitPrice", 100],
							},
							VAT: "$$this.VAT",
							invoiceId: "$$this.invoiceId",
							UM: "$$this.UM",
						},
					},
				},
				totalCost: 1,
				totalPayments: 1,
				typeOfInvoice: 1,
				series: 1,
				number: 1,
				date: 1,
				numberOfAccompanyingNotice: 1,
				isCancelled: 1,
				cancellationNotices: 1,
				borderColor: 1,
				addedBy: 1,
				editedBy: 1,
				companyId: 1,
				individualId: 1,
			},
		},
	];
};
