"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagination = void 0;
const getPagination = async (model, query) => {
    const pageIndex = parseInt(query.pageIndex) || 0;
    const limit = parseInt(query.pageSize) || 10;
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
        const sortDirection = query.sortDirection === "asc"
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
exports.getPagination = getPagination;
//# sourceMappingURL=shared-pagination.js.map