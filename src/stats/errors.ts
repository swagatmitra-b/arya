import { Series } from "../series";
import { sum } from "../utils/mathUtils";

/**
 * The Mean Squared Error
 * @param y_actual A `Series` object of the test set labels
 * @param y_pred  A `Series` object of the predictions
 * @returns The error
 */

export const MSE = (y_actual: Series, y_pred: Series) =>
  sum([y_actual, y_pred], (i, y_ac, y_pr) =>
    Math.pow(y_ac.data[i] - y_pr.data[i], 2)
  ) / y_actual.size;

/**
 * The Mean Absolute Error
 * @param y_actual A `Series` of the test set labels
 * @param y_pred  A `Series` of the predictions
 * @returns The error
 */

export const MAE = (y_actual: Series, y_pred: Series) =>
  sum([y_actual, y_pred], (i, y_ac, y_pr) =>
    Math.abs(y_ac.data[i] - y_pr.data[i])
  ) / y_actual.size;

/**
 * The Root Mean Squared Error
 * @param y_actual A `Series` of the test set labels
 * @param y_pred  A `Series` of the predictions
 * @returns The error
 */

export const RMSE = (y_actual: Series, y_pred: Series) =>
  Math.sqrt(MSE(y_actual, y_pred));

/**
 * The R2 Error
 * @param y_actual A `Series` of the test set labels
 * @param y_pred  A `Series` of the predictions
 * @returns The error
 */

export const R2 = (y_actual: Series, y_pred: Series) =>
  1 -
  sum([y_actual, y_pred], (i, y_actual, y_pred) =>
    Math.pow(y_actual.data[i] - y_pred.data[i], 2)
  ) /
    sum([y_actual, y_pred], (i, y_actual, y_pred) =>
      Math.pow(y_actual.data[i] - y_pred.aMean(), 2)
    );
