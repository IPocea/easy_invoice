"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPagination = void 0;
const getPagination = async (model, query) => {
    const pageIndex = parseInt(query.pageIndex) || 0;
    const limit = parseInt(query.pageSize) || 10;
    const options = [];
};
exports.getPagination = getPagination;
//# sourceMappingURL=shared-comp-indiv-pagination.js.map