"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFullInvoicePagination = void 0;
const all_invoice_aggregation_array_1 = require("./all-invoice-aggregation-array");
const full_invoice_keys_1 = require("./full-invoice-keys");
const getFullInvoicePagination = async (model, query) => {
    const pageIndex = parseInt(query.pageIndex) || 0;
    const limit = parseInt(query.pageSize) || 10;
    const options = [...all_invoice_aggregation_array_1.allInvoiceAggrArray];
    if (query.searchValue) {
        const orQueryArray = [];
        for (let key of full_invoice_keys_1.fullInvoiceTableKeys) {
            if (key === "totalCost" || key === "totalPayments") {
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
exports.getFullInvoicePagination = getFullInvoicePagination;
//# sourceMappingURL=invoice-pagination.js.map