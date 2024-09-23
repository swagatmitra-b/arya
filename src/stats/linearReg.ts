import { sum } from "../utils/mathUtils";
import { Series } from "../series";

/**
 * Linear Regression
 * @param x_train A `Series` object of the training set features
 * @param y_train A `Series` object of the training set labels
 * @param x_test A `Series` object  of the set features
 * @returns A `Series` object of the predicted values
 */

export function LinReg(x_train: Series, y_train: Series, x_test: Series) {
  const slope =
    sum(
      [x_train, y_train],
      (i, x, y) => (x.data[i] - x.aMean()) * (y.data[i] - y.aMean())
    ) / sum([x_train], (i, x) => Math.pow(x.data[i] - x.aMean(), 2));
  const intercept = y_train.aMean() - slope * x_train.aMean();

  let vals = [];
  for (let i = 0; i < x_test.size; i++) {
    vals.push(slope * x_test.data[i] + intercept);
  }
  return new Series(vals);
}
