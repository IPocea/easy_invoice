"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aggregationArray = void 0;
exports.aggregationArray = [
    {
        $lookup: {
            from: "invoices",
            localField: "_id",
            foreignField: "companyId",
            as: "invoices",
        },
    },
    {
        $unwind: {
            path: "$invoices",
            preserveNullAndEmptyArrays: true,
        },
    },
    {
        $lookup: {
            from: "products",
            localField: "invoices._id",
            foreignField: "invoiceId",
            as: "products",
        },
    },
    {
        $unwind: {
            path: "$products",
            preserveNullAndEmptyArrays: true,
        },
    },
    {
        $group: {
            _id: "$_id",
            name: {
                $first: "$name",
            },
            total_sum: {
                $sum: {
                    $multiply: ["$products.quantity", "$products.unitPrice"],
                },
            },
            invoice_ids: {
                $addToSet: "$invoices._id",
            },
        },
    },
    {
        $lookup: {
            from: "payments",
            localField: "invoice_ids",
            foreignField: "invoiceId",
            as: "payments",
        },
    },
    {
        $unwind: {
            path: "$payments",
            preserveNullAndEmptyArrays: true,
        },
    },
    {
        $group: {
            _id: "$_id",
            name: {
                $first: "$name",
            },
            total_sum: {
                $first: "$total_sum",
            },
            total_payment: {
                $sum: "$payments.paymentAmount",
            },
        },
    },
];
//# sourceMappingURL=shared-com-indiv-total-sum-and-payment.js.map