"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContractPagination = void 0;
const _1 = require(".");
const getContractPagination = async (model, query) => {
    const pageIndex = parseInt(query.pageIndex) || 0;
    const limit = parseInt(query.pageSize) || 10;
    const options = [..._1.contractsAggregationArray];
    if (query.searchValue) {
        const dataKeys = _1.objectKeysOfContract;
        const orQueryArray = [];
        for (let key of dataKeys) {
            switch (key) {
                case "invoice.totalCost":
                    orQueryArray.push({
                        [`${key}`]: { $eq: +query.searchValue },
                    });
                    break;
                case "CUI/CNP":
                    orQueryArray.push({
                        [`invoice.buyer.CUI`]: new RegExp(query.searchValue.toString(), "i"),
                    });
                    orQueryArray.push({
                        [`invoice.buyer.CNP`]: new RegExp(query.searchValue.toString(), "i"),
                    });
                default:
                    orQueryArray.push({
                        [`${key}`]: new RegExp(query.searchValue.toString(), "i"),
                    });
                    break;
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
            const sortBy = (0, _1.setFrontendKeysAsBackend)(query.sortBy);
            if (sortBy === "CUI/CNP") {
                options.push({
                    $sort: { [`invoice.buyer.CUI`]: sortDirection },
                });
                options.push({
                    $sort: { [`invoice.buyer.CNP`]: sortDirection },
                });
            }
            else {
                options.push({
                    $sort: { [`${sortBy}`]: sortDirection },
                });
            }
        }
    }
    else {
        options.push({
            $sort: { createdAt: -1 },
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
exports.getContractPagination = getContractPagination;
//# sourceMappingURL=get-contracts-pagination.js.map