"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAdminRole = void 0;
const common_1 = require("@nestjs/common");
function checkAdminRole(role) {
    if (role !== "admin")
        throw new common_1.UnauthorizedException("Necesita rol de admin");
}
exports.checkAdminRole = checkAdminRole;
//# sourceMappingURL=check-admin-role.js.map