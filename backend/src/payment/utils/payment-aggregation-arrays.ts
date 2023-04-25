import { PipelineStage, Types } from "mongoose";

export const getOneByIdAggArray = (paymentId: Types.ObjectId): PipelineStage[] => [
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
			_id: invoiceId,
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
