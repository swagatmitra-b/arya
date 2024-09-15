import { round } from "./utils/mathUtils";
import { Matrix2D } from "./matrix";

export type CramerType = {
  result: string;
  x: number;
  y: number;
  z: number;
};

export class Cramer {
  /**
   * The plain 2D array representation of the data
   */

  equationSet: Matrix2D;

  constructor(protected data: number[][]) {
    this.equationSet = new Matrix2D(data);
  }

  /**
   * Solves the system of equations
   * @returns An object with the x, y and/or z values
   */

  solve() {
    if (this.equationSet.cols == 3 && this.equationSet.rows == 2) {
      const data = this.equationSet.data;
      if (data[0][0] / data[1][0] != data[0][1] / data[1][1]) {
        const d1 = this.equationSet.stripCol(0).det();
        const d2 = -this.equationSet.stripCol(1).det();
        const d = this.equationSet.stripCol(2).det();
        return {
          result: "Unique Solution",
          x: round((d1 / d) * 1000) / 1000,
          y: round((d2 / d) * 1000) / 1000,
        };
      } else if (
        data[0][0] / data[1][0] == data[0][1] / data[1][1] &&
        data[0][1] / data[1][1] == data[0][2] / data[1][2]
      ) {
        return {
          result: "Infinite Solutions",
          x: null,
          y: null,
        };
      } else {
        return {
          result: "No Solution",
          x: null,
          y: null,
        };
      }
    } else if (this.equationSet.cols == 4 && this.equationSet.rows == 3) {
      const constant = this.equationSet.transpose().raw[3];
      const mat = this.equationSet.stripCol(3);
      const d = mat.det();
      const d1 = mat.replaceCol(0, constant).det();
      const d2 = mat.replaceCol(1, constant).det();
      const d3 = mat.replaceCol(2, constant).det();

      if (d != 0) {
        return {
          result: "Unique Solution",
          x: round((d1 / d) * 1000) / 1000,
          y: round((d2 / d) * 1000) / 1000,
          z: round((d3 / d) * 1000) / 1000,
        };
      } else {
        if (d1 != 0 || d2 != 0 || d3 != 0) {
          return {
            result: "No solution",
            x: null,
            y: null,
            z: null,
          };
        } else if (d1 == 0 && d2 == 0 && d2 == 0)
          return {
            result: "Infinite or no solutions",
            x: null,
            y: null,
            z: null,
          };
      }
    } else
      return {
        result: "Only system of equations with 2 and 3 variables are supported",
      };
  }
}