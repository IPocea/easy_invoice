"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCompIndivPagination = void 0;
const shared_comp_indiv_keys_1 = require("./shared-comp-indiv-keys");
const shared_comp_indiv_total_sum_and_payment_1 = require("./shared-comp-indiv-total-sum-and-payment");
const getCompIndivPagination = async (model, query, documentType, areActivesOnlyRequested) => {
    const pageIndex = parseInt(query.pageIndex) || 0;
    const limit = parseInt(query.pageSize) || 10;
    const aggregationArray = (0, shared_comp_indiv_total_sum_and_payment_1.getCompIndivAggArray)(documentType);
    const options = [...aggregationArray];
    if (areActivesOnlyRequested) {
        options.unshift({
            $match: {
                isActivated: true,
            },
        });
    }
    if (query.searchValue) {
        const dataKeys = (0, shared_comp_indiv_keys_1.getObjectKeys)(documentType);
        const orQueryArray = [];
        for (let key of dataKeys) {
            if (key === "totalSum" || key === "totalPayment") {
                orQueryArray.push({
                    [`${key}`]: { $eq: +query.searchValue },
                });
            }
            else {
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
        const sortDirection = query.sortDirection === "asc"
            ? 1
            : query.sortDirection === "desc"
                ? -1
                : null;
        if (sortDirection) {
            options.push({
                $sort: { [`${query.sortBy}`]: sortDirection },
            });
        }
    }
    else {
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
exports.getCompIndivPagination = getCompIndivPagination;
//# sourceMappingURL=shared-comp-indiv-pagination.js.map