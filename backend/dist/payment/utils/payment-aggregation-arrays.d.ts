import { PipelineStage, Types } from "mongoose";
export declare const getOneByIdAggArray: (paymentId: Types.ObjectId) => PipelineStage[];
export declare const getAllOfInvoiceAggArray: (invoiceId: Types.ObjectId) => PipelineStage[];
export declare const getInvoiceFromPaymentsController: (invoiceId: Types.ObjectId) => PipelineStage[];
