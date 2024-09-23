import { prod, sum } from "./utils/mathUtils";

export class Series {
  /**
   * The series data
   */

  data: Float32Array;

  /**
   * The number of data-points in the series
   */

  size: number;

  constructor(public vals: number[]) {
    this.data = new Float32Array(vals);
    this.size = this.data.length;
  }

  /**
   * The arithmetic mean of the series
   */

  aMean(weights: number[] = []) {
    if (weights.length)
      return sum(
        [this, new Series(weights)],
        (i, x, w) => x.data[i] * w.data[i]
      );
    else return sum([this]);
  }

  /**
   * The geometric mean of the series
   */

  gMean(weights: number[] = []) {
    if (weights.length)
      return Math.pow(
        prod([this, new Series(weights)], (i, x, w) =>
          Math.pow(x.data[i], w.data[i])
        ),
        1 / this.size
      );
    else return Math.pow(prod([this]), 1 / this.size);
  }

  /**
   * The harmonic mean of the series
   */

  hMean(weights: number[] = []) {
    if (weights.length) {
      let w = new Series(weights);
      return sum([w]) / sum([this, w], (i, x, w) => w.data[i] / x.data[i]);
    } else return this.size / sum([this], (i, x) => 1 / x.data[i]);
  }

  /**
   * The variance of the series
   */

  var() {
    return (
      sum([this], (i, x) => Math.pow(x.data[i] - x.aMean(), 2)) /
      (this.size - 1)
    );
  }

  /**
   * The standard deviation of the series
   */

  std() {
    return Math.sqrt(this.var());
  }

  /**
   * The largest value of the series
   */

  max() {
    let max = this.data[0];
    for (let i = 0; i < this.size; i++) {
      if (this.data[i] > max) max = this.data[i];
    }
    return max;
  }

  /**
   * The smallest value of the series
   */

  min() {
    let min = this.data[0];
    for (let i = 0; i < this.size; i++) {
      if (this.data[i] < min) min = this.data[i];
    }
    return min;
  }

  /**
   * Sorts the series
   * @param order 0 for ascending (default), 1 for descending
   */

  sort(order: 0 | 1 = 0) {
    this.data = this.data.sort((a, b) => (order ? b - a : a - b));
  }
}
