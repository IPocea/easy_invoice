import { Types } from "mongoose";
export declare const getSglInvoiceAggrArray: (invoiceId: Types.ObjectId) => ({
    $match: {
        _id: Types.ObjectId;
    };
    $lookup?: undefined;
    $addFields?: undefined;
    $project?: undefined;
} | {
    $lookup: {
        from: string;
        localField: string;
        foreignField: string;
        as: string;
    };
    $match?: undefined;
    $addFields?: undefined;
    $project?: undefined;
} | {
    $addFields: {
        totalCost: {
            $divide: (number | {
                $sum: {
                    $map: {
                        input: string;
                        in: {
                            $multiply: string[];
                        };
                    };
                };
            })[];
        };
        totalPayments: {
            $divide: (number | {
                $sum: string;
            })[];
        };
    };
    $match?: undefined;
    $lookup?: undefined;
    $project?: undefined;
} | {
    $project: {
        _id: number;
        buyer: {
            $arrayElemAt: (string | number)[];
        };
        seller: {
            $arrayElemAt: (string | number)[];
        };
        contract: {
            $arrayElemAt: (string | number)[];
        };
        payments: {
            $map: {
                input: string;
                in: {
                    _id: string;
                    invoiceId: string;
                    addedBy: string;
                    editedBy: string;
                    createdAt: string;
                    updatedAt: string;
                    paymentAmount: {
                        $divide: (string | number)[];
                    };
                };
            };
        };
        products: {
            $map: {
                input: string;
                in: {
                    _id: string;
                    name: string;
                    quantity: string;
                    unitPrice: {
                        $divide: (string | number)[];
                    };
                    VAT: string;
                    invoiceId: string;
                    UM: string;
                };
            };
        };
        totalCost: number;
        totalPayments: number;
        typeOfInvoice: number;
        paymentStatus: number;
        series: number;
        number: number;
        date: number;
        numberOfAccompanyingNotice: number;
        isCancelled: number;
        cancellationNotices: number;
        borderColor: number;
        addedBy: number;
        editedBy: number;
        companyId: number;
        individualId: number;
    };
    $match?: undefined;
    $lookup?: undefined;
    $addFields?: undefined;
})[];
