import { IQueryParams } from "src/utils/shared-interface";
import { allInvoiceAggrArray } from "./all-invoice-aggregation-array";
import { fullInvoiceTableKeys } from "./full-invoice-keys";

export const getFullInvoicePagination = async (
	model: any,
	query: IQueryParams
): Promise<any> => {
	const pageIndex: number = parseInt(query.pageIndex) || 0;
	const limit: number = parseInt(query.pageSize) || 10;
	const options = [...allInvoiceAggrArray];
	if (query.searchValue) {
		const orQueryArray = [];
		for (let key of fullInvoiceTableKeys) {
			if (key === "totalCost" || key === "totalPayments") {
				orQueryArray.push({
					[`${key}`]: { $eq: +query.searchValue },
				});
			} else {
				orQueryArray.push({
					[`${key}`]: new RegExp(query.searchValue.toString(), "i"),
				});
			}
		}
		options.push({
			$match: {
				$or: orQueryArray,
			},
		});
	}

	if (query.sortDirection) {
		const sortDirection =
			query.sortDirection === "asc"
				? 1
				: query.sortDirection === "desc"
				? -1
				: null;
		if (sortDirection) {
			options.push({
				$sort: { [`${query.sortBy}`]: sortDirection },
			});
		}
	} else {
		options.push({
			$sort: { updatedAt: -1 },
		});
	}

	const optionsUntouchedBySkipLimit = [...options];
	options.push({ $skip: pageIndex * limit });
	options.push({ $limit: limit });
	const filteredData = await model.aggregate(options).exec();
	const untouchedBySkipLimit = await model
		.aggregate(optionsUntouchedBySkipLimit)
		.exec();
	const total = untouchedBySkipLimit.length;
	return {
		data: filteredData,
		pageIndex: pageIndex,
		pageSize: limit,
		totalItems: total,
	};
};
