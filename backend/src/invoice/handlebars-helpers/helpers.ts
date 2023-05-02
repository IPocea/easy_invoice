import { IProduct } from "src/product/interface/product.interface";
import { add, divide, multiply, substract } from "src/utils/shared-operators";

export const getNoticeNumberHelper = () =>
	function (noticeNumber: string): string {
		return noticeNumber ? noticeNumber : "..............";
	};

export const getIsCancelledHelper = () =>
	function (isCancelled: boolean, cancellationNotices: string): string {
		if (isCancelled) {
			return cancellationNotices ? cancellationNotices : "Anulat";
		} else {
			return "";
		}
	};

export const getDateFormatHelper = () =>
	function (dateString: string) {
		const date = new Date(dateString);
		const year = date.getFullYear();
		let month: string | number = date.getMonth() + 1;
		month = month < 10 ? "0" + month : month;
		let day: string | number = date.getDate();
		day = day < 10 ? "0" + day : day;
		return `${day}.${month}.${year}`;
	};

export const getIndexPlusOneHelper = () =>
	function (value: any): number {
		return parseInt(value) + 1;
	};

export const getTotalOfProductHelper = () =>
	function (quantity: number, unitPrice: number): number {
		return multiply(quantity, unitPrice);
	};

export const getVatOfProductHelper = () =>
	function (quantity: number, unitPrice: number, vat: number): number {
		const totalRate = multiply(quantity, unitPrice);
		let vatRate = divide(multiply(totalRate, 100), add(100, vat));
		vatRate = substract(totalRate, vatRate);
		return vatRate;
	};

export const getTotalVatHelper = () =>
	function (products: IProduct[]): number {
		let total = 0;
		for (const product of products) {
			const totalRate = multiply(product.quantity, product.unitPrice);
			let vatRate = divide(multiply(totalRate, 100), add(100, product.VAT));
			vatRate = substract(totalRate, vatRate);
			total = add(total, vatRate);
		}
		return total;
	};
