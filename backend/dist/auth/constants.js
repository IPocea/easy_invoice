"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConstants = void 0;
const dotenv = require("dotenv");
dotenv.config();
exports.jwtConstants = {
    accessTokenSecret: process.env.accessTokenSecret,
    refreshTokenSecret: process.env.refreshTokenSecret,
    resetTokenSecret: process.env.resetTokenSecret,
    accessTokenExpirationTime: process.env.accessTokenExpirationTime,
    refreshTokenExpirationTime: process.env.refreshTokenExpirationTime,
    resetTokenExpirationTime: process.env.resetTokenExpirationTime,
};
//# sourceMappingURL=constants.js.map