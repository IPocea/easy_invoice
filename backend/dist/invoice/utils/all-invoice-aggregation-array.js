"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allInvoiceAggrArray = void 0;
exports.allInvoiceAggrArray = [
    {
        $lookup: {
            from: "buyers",
            localField: "_id",
            foreignField: "invoiceId",
            as: "buyer",
        },
    },
    {
        $lookup: {
            from: "products",
            localField: "_id",
            foreignField: "invoiceId",
            as: "products",
        },
    },
    {
        $lookup: {
            from: "payments",
            localField: "_id",
            foreignField: "invoiceId",
            as: "payments",
        },
    },
    {
        $addFields: {
            totalCost: {
                $divide: [
                    {
                        $sum: {
                            $map: {
                                input: "$products",
                                in: {
                                    $multiply: ["$$this.quantity", "$$this.unitPrice"],
                                },
                            },
                        },
                    },
                    100,
                ],
            },
            totalPayments: {
                $divide: [
                    {
                        $sum: "$payments.paymentAmount",
                    },
                    100,
                ],
            },
        },
    },
    {
        $project: {
            _id: 1,
            date: 1,
            buyer: {
                $arrayElemAt: ["$buyer", 0],
            },
            typeOfInvoice: 1,
            series: 1,
            number: 1,
            totalCost: 1,
            totalPayments: 1,
            paymentStatus: 1,
            createdAt: 1,
            isCancelled: 1,
            addedBy: 1,
        },
    },
];
//# sourceMappingURL=all-invoice-aggregation-array.js.map