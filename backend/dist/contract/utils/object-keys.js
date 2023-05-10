"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setFrontendKeysAsBackend = exports.objectKeysOfContract = void 0;
exports.objectKeysOfContract = [
    "number",
    "addedBy",
    "createdAt",
    "invoice.number",
    "invoice.date",
    "invoice.totalCost",
    "invoice.buyer.name",
    "CUI/CNP",
];
const setFrontendKeysAsBackend = (key) => {
    switch (key) {
        case "contractNumber":
            return "number";
        case "invoiceNumber":
            return "invoice.number";
        default:
            return key;
    }
};
exports.setFrontendKeysAsBackend = setFrontendKeysAsBackend;
//# sourceMappingURL=object-keys.js.map