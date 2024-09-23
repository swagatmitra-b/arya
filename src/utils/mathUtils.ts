import { Matrix2D } from "../matrix";
import { Series } from "../series";

export const sin = Math.sin;
export const cos = Math.cos;
export const sqrt = Math.sqrt;
export const pow = Math.pow;
export const atan2 = Math.atan2;
export const acos = Math.acos;
export const round = Math.round;

export function sum(
  series: Series[],
  fn: (i: number, ...args: Series[]) => number = (i, x) => x.data[i]
) {
  let sum = 0;
  for (let i = 0; i < series[0].size; i++) {
    sum += fn(i, ...series);
  }
  return sum;
}

export function prod(
  series: Series[],
  fn: (i: number, ...args: Series[]) => number = (i, x) => x.data[i]
) {
  let prod = 0;
  for (let i = 0; i < series[0].size; i++) {
    prod += fn(i, ...series);
  }
  return prod;
}
