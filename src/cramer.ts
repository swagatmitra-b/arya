import { round } from "./utils/mathUtils";
import { Matrix2D } from "./matrix";

export type CramerResult = {
  result: string;
  [variable: string]: number | string | null;
};

export class Cramer {
  equationSet: Matrix2D;

  constructor(data: number[][]) {
    const flat = data.flat();
    const rows = data.length;
    const cols = data[0].length;
    this.equationSet = new Matrix2D(new Float64Array(flat), rows, cols);
  }

  solve(): CramerResult {
    const mat = this.equationSet;
    const { rows, cols } = mat;

    const numVars = cols - 1;
    if (rows !== numVars) {
      return {
        result: "Only square systems with one constant column are supported",
      };
    }

    const A = mat.stripCol(numVars); // Coefficient matrix
    const b = mat.getColumn(numVars).data; // Constant column
    const d = A.det();

    const variableNames = this.generateVariableNames(numVars);
    const result: CramerResult = { result: "" };

    const dVars = variableNames.map((_, i) => A.replaceCol(i, b).det());

    if (d !== 0) {
      result.result = "Unique Solution";
      variableNames.forEach((v, i) => {
        result[v] = round((dVars[i] / d) * 1000) / 1000;
      });
    } else if (dVars.every(v => v === 0)) {
      result.result = "Infinite or no solutions";
      variableNames.forEach(v => (result[v] = null));
    } else {
      result.result = "No solution";
      variableNames.forEach(v => (result[v] = null));
    }

    return result;
  }

  private generateVariableNames(n: number): string[] {
    const base = "xyz";
    if (n <= base.length) return base.slice(0, n).split("");

    const vars = [];
    for (let i = 0; i < n; i++) {
      vars.push("x" + (i + 1));
    }
    return vars;
  }
}