import { pow, sqrt, sum } from "../utils/mathUtils";
import { Series } from "../series";

/**
 * Linear Regression
 * @param x_train A `Series` object of the training set features
 * @param y_train A `Series` object of the training set labels
 * @param x_test A `Series` object  of the set features
 * @returns A `Series` object of the predicted values
 */

export function LinReg(
  x_train: Series,
  y_train: Series,
  x_test: Series,
  y_test: Series
) {
  const slope =
    sum(
      [x_train, y_train],
      (i, x, y) => (x.data[i] - x.aMean()) * (y.data[i] - y.aMean())
    ) / sum([x_train], (i, x) => pow(x.data[i] - x.aMean(), 2));

  const intercept = y_train.aMean() - slope * x_train.aMean();

  let y_pred: Series | number[] = [];

  for (let i = 0; i < x_test.size; i++) {
    y_pred.push(slope * x_test.data[i] + intercept);
  }

  y_pred = new Series(y_pred);

  const RSS = sum([y_test, y_pred], (i, y_test, y_pred) =>
    pow(y_test.data[i] - y_pred.data[i], 2)
  );

  const residualSE = sqrt(RSS / (y_train.size - 2)); // equal to sigma_hat, which is an estimation of the
  // of the true population std that is generally unknown

  const slopeSE = sqrt(
    residualSE / sum([x_train], (i, x) => pow(x.data[i] - x.aMean(), 2))
  );

  const interceptSE = sqrt(
    residualSE *
      (1 / y_train.size +
        pow(x_train.aMean(), 2) /
          sum([x_train], (i, x) => pow(x.data[i] - x.aMean(), 2)))
  );

  return {
    y_pred,
    residualSE,
    slopeSE,
    interceptSE,
  };
}
