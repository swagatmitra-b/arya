import { Series } from "../series";

export const sin = Math.sin;
export const cos = Math.cos;
export const sqrt = Math.sqrt;
export const pow = Math.pow;
export const atan2 = Math.atan2;
export const acos = Math.acos;
export const round = Math.round;
export const abs = Math.abs;

/**
 * Sum over a list of Series
 */

export function sum(
  series: Series[],
  fn: (i: number, ...args: Series[]) => number = (i, x) => x.data[i],
): number {
  if (series.length === 0) return 0;

  const size = series[0].size;
  let total = 0;

  for (let i = 0; i < size; i++) {
    total += fn(i, ...series);
  }

  return total;
}

/**
 * Product over a list of Series
 */
export function prod(
  series: Series[],
  fn: (i: number, ...args: Series[]) => number = (i, x) => x.data[i],
): number {
  if (series.length === 0) return 1;

  const size = series[0].size;
  let result = 1;

  for (let i = 0; i < size; i++) {
    result *= fn(i, ...series);
  }

  return result;
}
