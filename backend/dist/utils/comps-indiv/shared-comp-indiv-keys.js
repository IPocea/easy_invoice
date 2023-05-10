"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getObjectKeys = void 0;
const getObjectKeys = (documentType) => {
    const keys = [
        "name",
        "headquarters",
        "bankAccount",
        "bank",
        "email",
        "phone",
        "isActivated",
        "addedBy",
        "editedBy",
        "totalSum",
        "totalPayment",
    ];
    switch (documentType) {
        case "company":
            keys.splice(keys.length, 0, "J", "CUI", "vatRate");
            break;
        case "individual":
            keys.splice(keys.length, 0, "series", "CNP");
            break;
        default:
            break;
    }
    return keys;
};
exports.getObjectKeys = getObjectKeys;
//# sourceMappingURL=shared-comp-indiv-keys.js.map