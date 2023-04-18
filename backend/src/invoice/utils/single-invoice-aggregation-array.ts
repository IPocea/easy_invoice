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
					$sum: {
						$map: {
							input: "$products",
							in: {
								$multiply: ["$$this.quantity", "$$this.unitPrice"],
							},
						},
					},
				},
				totalPayments: {
					$sum: "$payments.paymentAmount",
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
				payments: 1,
				products: 1,
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
			},
		},
	];
};
