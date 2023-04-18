import { IQueryParams } from "./shared-interface";

export const getPagination = async (
	model: any,
	query: IQueryParams
): Promise<any> => {
	const pageIndex: number = parseInt(query.pageIndex) || 0;
	const limit: number = parseInt(query.pageSize) || 10;
	let options = {};

	if (query.searchValue) {
		options = {
			$or: [
				{ username: new RegExp(query.searchValue.toString(), "i") },
				{ email: new RegExp(query.searchValue.toString(), "i") },
			],
		};
	}

	const dbQuery = model.find(options);

	if (query.sortDirection && query.sortBy) {
		const sortDirection =
			query.sortDirection === "asc"
				? 1
				: query.sortDirection === "desc"
				? -1
				: null;
		if (sortDirection) {
			dbQuery.sort({ [`${query.sortBy}`]: sortDirection });
		}
	}

	const total = await model.count(options).exec();
	const data = await dbQuery
		.skip(pageIndex * limit)
		.limit(limit)
		.select("-password")
		.exec();

	return {
		data: data,
		pageIndex: pageIndex,
		pageSize: limit,
		totalItems: total,
	};
};
