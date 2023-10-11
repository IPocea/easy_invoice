"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contractsAggregationArray = void 0;
exports.contractsAggregationArray = [
    {
        $lookup: {
            from: "invoices",
            localField: "invoiceId",
            foreignField: "_id",
            as: "invoice",
            pipeline: [
                {
                    $lookup: {
                        from: "companies",
                        localField: "companyId",
                        foreignField: "_id",
                        as: "company",
                    },
                },
            ],
        },
    },
];
//# sourceMappingURL=aggregation-array.js.map