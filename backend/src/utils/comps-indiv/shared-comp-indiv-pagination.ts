import { IQueryParams } from "../shared-interface";
import { getObjectKeys } from "./shared-comp-indiv-keys";
import { getCompIndivAggArray } from "./shared-comp-indiv-total-sum-and-payment";

export const getCompIndivPagination = async (
	model: any,
	query: IQueryParams,
	documentType: string
): Promise<any> => {
	const pageIndex: number = parseInt(query.pageIndex) || 0;
	const limit: number = parseInt(query.pageSize) || 10;
	const options = [];
	const aggregationArray = getCompIndivAggArray(documentType);

	if (query.searchValue) {
		const dataKeys = getObjectKeys(documentType);
		const orQueryArray = [];
		for (let key of dataKeys) {
			orQueryArray.push({
				[`${key}`]: new RegExp(query.searchValue.toString(), "i"),
			});
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
	const finalOptions = options.concat(aggregationArray);
	const filteredData = await model.aggregate(finalOptions).exec();
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
