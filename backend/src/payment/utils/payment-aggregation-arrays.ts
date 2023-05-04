import { PipelineStage, Types } from "mongoose";

export const getOneByIdAggArray = (
	paymentId: Types.ObjectId
): PipelineStage[] => [
	{
		$match: {
			_id: paymentId,
		},
	},
	{
		$project: {
			_id: 1,
			invoiceId: 1,
			paymentAmount: {
				$divide: ["$paymentAmount", 100],
			},
			addedBy: 1,
			editedBy: 1,
			createdAt: 1,
			updatedAt: 1,
		},
	},
];

export const getAllOfInvoiceAggArray = (
	invoiceId: Types.ObjectId
): PipelineStage[] => [
	{
		$match: {
			invoiceId: invoiceId,
		},
	},
	{
		$sort: { createdAt: -1 },
	},
	{
		$project: {
			_id: 1,
			invoiceId: 1,
			paymentAmount: {
				$divide: ["$paymentAmount", 100],
			},
			addedBy: 1,
			editedBy: 1,
			createdAt: 1,
			updatedAt: 1,
		},
	},
];

export const getInvoiceFromPaymentsController = (
	invoiceId: Types.ObjectId
): PipelineStage[] => [
	{
		$match: {
			_id: invoiceId,
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
