import { prod, sum } from "./utils/mathUtils";

export class Series {
  data: Float64Array;
  size: number;

  constructor(vals: number[] | Float64Array) {
    this.data = vals instanceof Float64Array ? vals : new Float64Array(vals);
    this.size = this.data.length;
  }

  /**
   * Arithmetic mean
   */
  aMean(weights?: number[] | Float64Array): number {
    if (weights && weights.length) {
      const w = new Float64Array(weights);
      const weightedSum = sum([this, new Series(w)], (i, x, w) => x.data[i] * w.data[i]);
      const totalWeight = sum([new Series(w)]);
      return weightedSum / totalWeight;
    } else {
      return sum([this]) / this.size;
    }
  }

  /**
   * Geometric mean
   */
  gMean(weights?: number[] | Float64Array): number {
    if (weights && weights.length) {
      const w = new Float64Array(weights);
      return Math.pow(
        prod([this, new Series(w)], (i, x, w) => Math.pow(x.data[i], w.data[i])),
        1 / sum([new Series(w)])
      );
    } else {
      return Math.pow(prod([this]), 1 / this.size);
    }
  }

  /**
   * Harmonic mean
   */
  hMean(weights?: number[] | Float64Array): number {
    if (weights && weights.length) {
      const w = new Float64Array(weights);
      const weightedSum = sum([new Series(w)]);
      const denom = sum([this, new Series(w)], (i, x, w) => w.data[i] / x.data[i]);
      return weightedSum / denom;
    } else {
      return this.size / sum([this], (i, x) => 1 / x.data[i]);
    }
  }

  /**
   * Sample variance (unbiased)
   */
  var(): number {
    const mean = this.aMean();
    return sum([this], (i, x) => {
      const diff = x.data[i] - mean;
      return diff * diff;
    }) / (this.size - 1);
  }

  /**
   * Standard deviation
   */
  std(): number {
    return Math.sqrt(this.var());
  }

  /**
   * Maximum value
   */
  max(): number {
    let max = this.data[0];
    for (let i = 1; i < this.size; i++) {
      if (this.data[i] > max) max = this.data[i];
    }
    return max;
  }

  /**
   * Minimum value
   */
  min(): number {
    let min = this.data[0];
    for (let i = 1; i < this.size; i++) {
      if (this.data[i] < min) min = this.data[i];
    }
    return min;
  }

  /**
   * In-place sort
   */
  sort(order: 0 | 1 = 0): void {
    const sorted = Array.from(this.data).sort((a, b) => (order === 0 ? a - b : b - a));
    this.data.set(sorted);
  }
}

