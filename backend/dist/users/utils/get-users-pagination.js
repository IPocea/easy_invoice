"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsersPagination = void 0;
const getUsersPagination = async (model, query) => {
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
    const usersQuery = model.find(options);
    if (query.sortDirection && query.sortBy) {
        const sortDirection = query.sortDirection === "asc"
            ? 1
            : query.sortDirection === "desc"
                ? -1
                : null;
        if (sortDirection) {
            usersQuery.sort({ [`${query.sortBy}`]: sortDirection });
        }
    }
    const total = await model.count(options).exec();
    const users = await usersQuery
        .skip(pageIndex * limit)
        .limit(limit)
        .select("-password")
        .exec();
    return {
        data: users,
        pageIndex: pageIndex,
        pageSize: limit,
        totalItems: total,
    };
};
exports.getUsersPagination = getUsersPagination;
//# sourceMappingURL=get-users-pagination.js.map