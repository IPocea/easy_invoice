"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserAndPaginate = void 0;
const get_users_pagination_1 = require("./get-users-pagination");
const updateUserAndPaginate = async (user, model, query) => {
    const newUser = new model(user);
    await newUser.save();
    const filters = {
        pageIndex: '0',
        pageSize: (query === null || query === void 0 ? void 0 : query.pageSize.toString()) || '10',
    };
    return await (0, get_users_pagination_1.getUsersPagination)(model, filters);
};
exports.updateUserAndPaginate = updateUserAndPaginate;
//# sourceMappingURL=update-users-pagination.js.map