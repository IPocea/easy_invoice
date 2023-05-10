import { IProduct } from "src/product/interface/product.interface";
export declare const getNoticeNumberHelper: () => (noticeNumber: string) => string;
export declare const getIsCancelledHelper: () => (isCancelled: boolean, cancellationNotices: string) => string;
export declare const getDateFormatHelper: () => (dateString: string) => string;
export declare const getIndexPlusOneHelper: () => (value: any) => number;
export declare const getTotalOfProductHelper: () => (quantity: number, unitPrice: number) => number;
export declare const getVatOfProductHelper: () => (quantity: number, unitPrice: number, vat: number) => number;
export declare const getTotalVatHelper: () => (products: IProduct[]) => number;
