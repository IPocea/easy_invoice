"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTotalVatHelper = exports.getVatOfProductHelper = exports.getTotalOfProductHelper = exports.getIndexPlusOneHelper = exports.getDateFormatHelper = exports.getIsCancelledHelper = exports.getNoticeNumberHelper = void 0;
const shared_operators_1 = require("../../utils/shared-operators");
const getNoticeNumberHelper = () => function (noticeNumber) {
    return noticeNumber ? noticeNumber : "..............";
};
exports.getNoticeNumberHelper = getNoticeNumberHelper;
const getIsCancelledHelper = () => function (isCancelled, cancellationNotices) {
    if (isCancelled) {
        return cancellationNotices ? cancellationNotices : "Anulat";
    }
    else {
        return "";
    }
};
exports.getIsCancelledHelper = getIsCancelledHelper;
const getDateFormatHelper = () => function (dateString) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    let month = date.getMonth() + 1;
    month = month < 10 ? "0" + month : month;
    let day = date.getDate();
    day = day < 10 ? "0" + day : day;
    return `${day}.${month}.${year}`;
};
exports.getDateFormatHelper = getDateFormatHelper;
const getIndexPlusOneHelper = () => function (value) {
    return parseInt(value) + 1;
};
exports.getIndexPlusOneHelper = getIndexPlusOneHelper;
const getTotalOfProductHelper = () => function (quantity, unitPrice) {
    return (0, shared_operators_1.multiply)(quantity, unitPrice);
};
exports.getTotalOfProductHelper = getTotalOfProductHelper;
const getVatOfProductHelper = () => function (quantity, unitPrice, vat) {
    const totalRate = (0, shared_operators_1.multiply)(quantity, unitPrice);
    let vatRate = (0, shared_operators_1.divide)((0, shared_operators_1.multiply)(totalRate, 100), (0, shared_operators_1.add)(100, vat));
    vatRate = (0, shared_operators_1.substract)(totalRate, vatRate);
    return vatRate;
};
exports.getVatOfProductHelper = getVatOfProductHelper;
const getTotalVatHelper = () => function (products) {
    let total = 0;
    for (const product of products) {
        const totalRate = (0, shared_operators_1.multiply)(product.quantity, product.unitPrice);
        let vatRate = (0, shared_operators_1.divide)((0, shared_operators_1.multiply)(totalRate, 100), (0, shared_operators_1.add)(100, product.VAT));
        vatRate = (0, shared_operators_1.substract)(totalRate, vatRate);
        total = (0, shared_operators_1.add)(total, vatRate);
    }
    return total;
};
exports.getTotalVatHelper = getTotalVatHelper;
//# sourceMappingURL=helpers.js.map