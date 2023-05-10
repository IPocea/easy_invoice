"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.integralNumbersOnly = exports.passwordRegexpPattern = exports.emailRegexpPattern = void 0;
exports.emailRegexpPattern = /[a-z0-9\-_.0]+@[a-z0-9\-_.]+\.[a-z]{2,}/i;
exports.passwordRegexpPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$!%*?&\^\(\)])[A-Za-z\d@#$!%*?&\^\(\)\.]{8,}$/;
exports.integralNumbersOnly = /^\s*\d*\s*$/;
//# sourceMappingURL=regexp-patterns.js.map