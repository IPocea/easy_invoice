"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkIdValidity = exports.checkEmailPattern = exports.checkPasswordPattern = exports.checkRole = exports.checkEmptyInputs = void 0;
const common_1 = require("@nestjs/common");
const regexp_patterns_1 = require("./regexp-patterns");
const mongoose_1 = require("mongoose");
const ROLES = ["user", "admin"];
const emailPattern = regexp_patterns_1.emailRegexpPattern;
const passwordPattern = regexp_patterns_1.passwordRegexpPattern;
const ObjectId = mongoose_1.Types.ObjectId;
function checkEmptyInputs(...args) {
    for (const arg of args) {
        if (typeof arg !== "number" && !arg) {
            throw new common_1.BadRequestException("Te rugam sa completezi toate campurile obligatorii");
        }
        else if (arg === "" || arg === undefined || arg === null) {
            throw new common_1.BadRequestException("Te rugam sa completezi toate campurile obligatorii");
        }
    }
}
exports.checkEmptyInputs = checkEmptyInputs;
function checkRole(role) {
    if (!role) {
        return (role = "user");
    }
    else if (!ROLES.includes(role)) {
        throw new common_1.BadRequestException(`Rolul ${role} nu exista!`);
    }
}
exports.checkRole = checkRole;
function checkPasswordPattern(password) {
    if (!passwordPattern.test(password)) {
        throw new common_1.BadRequestException("Parola trebue sa contina cel putin 8 caractere, macar o litera mica, o litera mare, un numar si un caracter special.");
    }
}
exports.checkPasswordPattern = checkPasswordPattern;
function checkEmailPattern(email) {
    if (!emailPattern.test(email)) {
        throw new common_1.BadRequestException("Email invalid!");
    }
}
exports.checkEmailPattern = checkEmailPattern;
function checkIdValidity(...args) {
    for (const arg of args) {
        if (!ObjectId.isValid(arg)) {
            throw new common_1.BadRequestException("Formatul de id este invalid");
        }
    }
}
exports.checkIdValidity = checkIdValidity;
//# sourceMappingURL=shared-middlewares.js.map