"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.divide = exports.multiply = exports.substract = exports.add = void 0;
const correction = (num) => +parseFloat(num.toPrecision(15)).toFixed(2);
const add = (num1, num2) => correction(num1 + num2);
exports.add = add;
const substract = (num1, num2) => correction(num1 - num2);
exports.substract = substract;
const multiply = (num1, num2) => correction(num1 * num2);
exports.multiply = multiply;
const divide = (num1, num2) => correction(num1 / num2);
exports.divide = divide;
//# sourceMappingURL=shared-operators.js.map