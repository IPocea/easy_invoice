const correction = (num: number): number =>
  +parseFloat(num.toPrecision(15)).toFixed(2);
export const add = (num1: number, num2: number): number =>
  correction(num1 + num2);
export const substract = (num1: number, num2: number): number =>
  correction(num1 - num2);
export const multiply = (num1: number, num2: number): number =>
  correction(num1 * num2);
export const divide = (num1: number, num2: number): number =>
  correction(num1 / num2);
