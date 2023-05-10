import { Types } from "mongoose";
export declare const contractsSingleAggrArray: (contractId: Types.ObjectId) => ({
    $match: {
        _id: Types.ObjectId;
    };
    $lookup?: undefined;
    $project?: undefined;
} | {
    $lookup: {
        from: string;
        localField: string;
        foreignField: string;
        as: string;
        pipeline: ({
            $lookup: {
                from: string;
                localField: string;
                foreignField: string;
                as: string;
            };
            $addFields?: undefined;
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
            };
            $lookup?: undefined;
        })[];
    };
    $match?: undefined;
    $project?: undefined;
} | {
    $project: {
        "invoice.products": number;
    };
    $match?: undefined;
    $lookup?: undefined;
})[];
