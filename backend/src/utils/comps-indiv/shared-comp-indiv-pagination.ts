import { IQueryParams } from "../shared-interface";
import { getObjectKeys } from "./shared-comp-indiv-keys";
import { getCompIndivAggArray } from "./shared-comp-indiv-total-sum-and-payment";

export const getCompIndivPagination = async (
	model: any,
	query: IQueryParams,
	documentType: string,
	areActivesOnlyRequested?: boolean
): Promise<any> => {
	const pageIndex: number = parseInt(query.pageIndex) || 0;
	const limit: number = parseInt(query.pageSize) || 10;
	const aggregationArray = getCompIndivAggArray(documentType);
	const options = [...aggregationArray];
	if (areActivesOnlyRequested) {
		options.unshift({
			$match: {
				isActivated: true,
			},
		});
	}

	if (query.searchValue) {
		const dataKeys = getObjectKeys(documentType);
		const orQueryArray = [];
		for (let key of dataKeys) {
			if (key === "totalSum" || key === "totalPayment") {
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
