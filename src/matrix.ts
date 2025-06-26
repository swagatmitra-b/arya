import { pow, round, sum } from "./utils/mathUtils";
import { Vector2, Vector3 } from "./vector";
import { Series } from "./series";

export class Matrix2D {
  rows: number;
  cols: number;
  data: Float64Array;

  static identity(n: number): Matrix2D {
    const data = new Float64Array(n * n);
    for (let i = 0; i < n; i++) data[i * n + i] = 1;
    return new Matrix2D(data, n, n);
  }

  constructor(
    private values: number[][] | Float64Array = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ],
    private initRows: number = 3,
    private initCols: number = 3
  ) {
    if (Array.isArray(values)) {
      const rows = values[0].length ? values.length : 1;
      const cols = values[0].length || values.length;
      const data = new Float64Array(rows * cols);
      let k = 0;
      for (let i = 0; i < rows; ++i) {
        const row = values[i];
        for (let j = 0; j < cols; ++j) {
          data[k++] = row[j];
        }
      }
      this.rows = rows;
      this.cols = cols;
      this.data = data;
    } else {
      if (initRows * initCols != values.length)
        throw new Error("Please enter matrix dimensions");
      this.rows = initRows;
      this.cols = initCols;
      this.data = values;
    }
  }

  dim(): [number, number] {
    return [this.rows, this.cols];
  }

  clone() {
    return new Matrix2D(this.data, this.rows, this.cols);
  }

  add(mat: Matrix2D) {
    const { rows, cols } = this;
    const matRows = mat.rows;
    const matCols = mat.cols;
    const sameDims = rows === matRows && cols === matCols;
    if (!sameDims) throw new Error("Matrix dimensions do not match");
    const result = new Float64Array(rows * cols);
    const a = this.data;
    const b = mat.data;
    const len = a.length;
    for (let i = 0; i < len; i++) {
      result[i] = a[i] + b[i];
    }
    return new Matrix2D(result, rows, cols);
  }

  addIn(mat: Matrix2D) {
    const { rows, cols } = this;
    const matRows = mat.rows;
    const matCols = mat.cols;
    const sameDims = rows === matRows && cols === matCols;
    if (!sameDims) throw new Error("Matrix dimensions do not match");
    const a = this.data;
    const b = mat.data;
    const len = a.length;
    for (let i = 0; i < len; i++) {
      a[i] += b[i];
    }
    this.data = a;
    return this;
  }

  sub(mat: Matrix2D) {
    const { rows, cols } = this;
    const matRows = mat.rows;
    const matCols = mat.cols;
    const sameDims = rows === matRows && cols === matCols;
    if (!sameDims) throw new Error("Matrix dimensions do not match");
    const result = new Float64Array(rows * cols);
    const a = this.data;
    const b = mat.data;
    const len = a.length;
    for (let i = 0; i < len; i++) {
      result[i] = a[i] - b[i];
    }
    return new Matrix2D(result, rows, cols);
  }

  subIn(mat: Matrix2D) {
    const { rows, cols } = this;
    const matRows = mat.rows;
    const matCols = mat.cols;
    const sameDims = rows === matRows && cols === matCols;
    if (!sameDims) throw new Error("Matrix dimensions do not match");
    const a = this.data;
    const b = mat.data;
    const len = a.length;
    for (let i = 0; i < len; i++) {
      a[i] -= b[i];
    }
    this.data = a;
    return this;
  }

  scalarAdd(scalar: number) {
    const { rows, cols } = this;
    const result = new Float64Array(rows * cols);
    const a = this.data;
    const len = a.length;
    for (let i = 0; i < len; i++) {
      result[i] = a[i] + scalar;
    }
    return new Matrix2D(result, rows, cols);
  }

  scalarAddIn(scalar: number) {
    const a = this.data;
    const len = a.length;
    for (let i = 0; i < len; i++) {
      a[i] += scalar;
    }
    this.data = a;
    return this;
  }

  scalarMul(scalar: number) {
    const { rows, cols } = this;
    const result = new Float64Array(rows * cols);
    const a = this.data;
    const len = a.length;
    for (let i = 0; i < len; i++) {
      result[i] = a[i] * scalar;
    }
    return new Matrix2D(result, rows, cols);
  }

  scalarMulIn(scalar: number) {
    const a = this.data;
    const len = a.length;
    for (let i = 0; i < len; i++) {
      a[i] *= scalar;
    }
    this.data = a;
    return this;
  }

  matMul(mat: Matrix2D) {
    const aRows = this.rows;
    const aCols = this.cols;
    const bRows = mat.rows;
    const bCols = mat.cols;
    if (aCols != bRows) throw new Error("Matrices are not comformable");

    const a = this.data;
    const b = mat.data;
    const result = new Float64Array(aRows * bCols);
    for (let i = 0; i < aRows; i++) {
      const aRowStart = i * aCols;
      const resultRowStart = i * bCols;
      for (let j = 0; j < bCols; j++) {
        let sum = 0;
        for (let k = 0; k < aCols; k++) {
          sum += a[aRowStart + k] * b[k * bCols + j];
        }
        result[resultRowStart + j] = sum;
      }
    }
    return new Matrix2D(result, aRows, bCols);
  }

  transpose() {
    const a = this.data;
    const { rows, cols } = this;

    const result = new Float64Array(rows * cols);

    for (let i = 0; i < rows; i++) {
      const rowOffset = i * cols;
      for (let j = 0; j < cols; j++) {
        result[j * rows + i] = a[rowOffset + j];
      }
    }

    return new Matrix2D(result, rows, cols);
  }

  transposeIn() {
    const a = this.data;
    const { rows, cols } = this;

    const result = new Float64Array(rows * cols);

    for (let i = 0; i < rows; i++) {
      const rowOffset = i * cols;
      for (let j = 0; j < cols; j++) {
        result[j * rows + i] = a[rowOffset + j];
      }
    }

    this.data = result;
    this.rows = cols;
    this.cols = rows;
    return this;
  }

  toVector2() {
    const a = this.data;
    const { rows, cols } = this;
    if ((rows == 2 && cols == 1) || (cols == 2 && rows == 1))
      return new Vector2(a[0], a[1]);
    else throw new Error("Matrix cannot be converted to Vector2");
  }

  toVector3() {
    const a = this.data;
    const { rows, cols } = this;
    if ((rows == 3 && cols == 1) || (cols == 1 && rows == 3))
      return new Vector3(a[0], a[1], a[2]);
    else throw new Error("Matrix cannot be converted to Vector3");
  }

  trace() {
    const a = this.data;
    const { rows, cols } = this;
    if (rows !== cols) {
      throw new Error("Trace is only defined for square matrices.");
    }
    let trace = 0;
    for (let i = 0; i < rows; i++) {
      trace += a[i * cols + i];
    }
    return trace;
  }

  private getMinorMatrix(row: number, col: number): Matrix2D {
    const { rows, cols } = this;
    const a = this.data;

    const minor = new Float64Array((rows - 1) * (cols - 1));
    let idx = 0;

    for (let i = 0; i < rows; i++) {
      if (i === row) continue;
      const rowOffset = i * cols;
      for (let j = 0; j < cols; j++) {
        if (j === col) continue;
        minor[idx++] = a[rowOffset + j];
      }
    }
    return new Matrix2D(minor, rows - 1, cols - 1);
  }

  luDecomposition(): {
    L: Float64Array;
    U: Float64Array;
    pivot: number[];
    swapCount: number;
  } {
    if (this.rows !== this.cols) {
      throw new Error("LU decomposition requires a square matrix");
    }

    const n = this.rows;
    const L = new Float64Array(n * n);
    const U = new Float64Array(this.data);
    const pivot = Array.from({ length: n }, (_, i) => i);
    let swapCount = 0;

    for (let i = 0; i < n; i++) {
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(U[k * n + i]) > Math.abs(U[maxRow * n + i])) {
          maxRow = k;
        }
      }

      if (maxRow !== i) {
        for (let k = 0; k < n; k++) {
          [U[i * n + k], U[maxRow * n + k]] = [U[maxRow * n + k], U[i * n + k]];
        }
        [pivot[i], pivot[maxRow]] = [pivot[maxRow], pivot[i]];
        swapCount++;
      }

      if (U[i * n + i] === 0) {
        throw new Error("Matrix is singular and cannot be decomposed");
      }

      for (let j = i + 1; j < n; j++) {
        L[j * n + i] = U[j * n + i] / U[i * n + i];
        for (let k = i; k < n; k++) {
          U[j * n + k] -= L[j * n + i] * U[i * n + k];
        }
      }
    }

    for (let i = 0; i < n; i++) {
      L[i * n + i] = 1;
    }

    return { L, U, pivot, swapCount };
  }

  det(): number {
    const { U, swapCount } = this.luDecomposition();
    const n = this.rows;

    let determinant = 1;
    for (let i = 0; i < n; i++) {
      determinant *= U[i * n + i];
    }

    if (swapCount % 2 !== 0) {
      determinant *= -1;
    }

    return round(determinant);
  }

  getAdjoint() {
    const rows = this.rows;
    const cols = this.cols;
    if (rows !== cols)
      throw new Error("Adjoint only defined for square matrices");
    let cofactorMatrix = new Float64Array(rows * cols);
    for (let i = 0; i < rows; i++) {
      const rowOffset = i * cols;
      for (let j = 0; j < cols; j++) {
        cofactorMatrix[rowOffset + j] =
          this.getMinorMatrix(i, j).det() * pow(-1, i + j);
      }
    }
    return new Matrix2D(cofactorMatrix, rows, cols).transpose();
  }

  inverse() {
    if (this.rows !== this.cols)
      throw new Error("Inverse is only defined for square matrices");
    const det = this.det();
    console.log(det);
    if (det == 0)
      throw new Error("Inverse does not exist for a singular matrix");
    return this.getAdjoint().scalarMul(1 / det);
  }

  exp(power: number = 2) {
    if (this.rows !== this.cols) {
      throw new Error("Matrix exponentiation requires a square matrix");
    }
    let result = Matrix2D.identity(this.rows);
    let base = this.clone();
    while (power > 0) {
      if (power % 2 === 1) {
        result = result.matMul(base);
      }
      base = base.matMul(base);
      power = Math.floor(power / 2);
    }
    return result;
  }

  stripRow(idx: number): Matrix2D {
    const { rows, cols, data } = this;
    if (idx < 0 || idx >= rows) throw new Error("Invalid row index");

    const result = new Float64Array((rows - 1) * cols);
    let k = 0;
    for (let i = 0; i < rows; i++) {
      if (i === idx) continue;
      const offset = i * cols;
      for (let j = 0; j < cols; j++) {
        result[k++] = data[offset + j];
      }
    }
    return new Matrix2D(result, rows - 1, cols);
  }

  stripRowIn(idx: number): this {
    const { rows, cols, data } = this;
    if (idx < 0 || idx >= rows) throw new Error("Invalid row index");

    const newData = new Float64Array((rows - 1) * cols);
    let k = 0;
    for (let i = 0; i < rows; i++) {
      if (i === idx) continue;
      const offset = i * cols;
      for (let j = 0; j < cols; j++) {
        newData[k++] = data[offset + j];
      }
    }

    this.data = newData;
    this.rows = rows - 1;
    return this;
  }

  stripCol(idx: number): Matrix2D {
    const { rows, cols, data } = this;
    if (idx < 0 || idx >= cols) throw new Error("Invalid column index");

    const result = new Float64Array(rows * (cols - 1));
    let k = 0;
    for (let i = 0; i < rows; i++) {
      const offset = i * cols;
      for (let j = 0; j < cols; j++) {
        if (j === idx) continue;
        result[k++] = data[offset + j];
      }
    }
    return new Matrix2D(result, rows, cols - 1);
  }

  stripColIn(idx: number): this {
    const { rows, cols, data } = this;
    if (idx < 0 || idx >= cols) throw new Error("Invalid column index");

    const newData = new Float64Array(rows * (cols - 1));
    let k = 0;
    for (let i = 0; i < rows; i++) {
      const offset = i * cols;
      for (let j = 0; j < cols; j++) {
        if (j === idx) continue;
        newData[k++] = data[offset + j];
      }
    }

    this.data = newData;
    this.cols = cols - 1;
    return this;
  }

  replaceCol(colIndex: number, values: Float64Array): Matrix2D {
    const newData = this.data.slice();
    if (values.length !== this.rows) {
      throw new Error("Column length mismatch");
    }

    for (let i = 0; i < this.rows; i++) {
      newData[i * this.cols + colIndex] = values[i];
    }

    return new Matrix2D(newData, this.rows, this.cols);
  }

  replaceColIn(colIndex: number, values: Float64Array): this {
    if (values.length !== this.rows) {
      throw new Error("Column length mismatch");
    }

    for (let i = 0; i < this.rows; i++) {
      this.data[i * this.cols + colIndex] = values[i];
    }
    return this;
  }

  replaceRowIn(rowIndex: number, values: Float64Array): this {
    if (values.length !== this.cols) {
      throw new Error("Row length mismatch");
    }

    const offset = rowIndex * this.cols;
    for (let j = 0; j < this.cols; j++) {
      this.data[offset + j] = values[j];
    }
    return this;
  }
  replaceRow(rowIndex: number, values: Float64Array): Matrix2D {
    const newData = this.data.slice();
    if (values.length !== this.cols) {
      throw new Error("Row length mismatch");
    }

    const offset = rowIndex * this.cols;
    for (let j = 0; j < this.cols; j++) {
      newData[offset + j] = values[j];
    }

    return new Matrix2D(newData, this.rows, this.cols);
  }

  updateVal(row: number, col: number, value: number) {
    this.data[row * this.cols + col] = value;
  }

  concatHorizontal(other: Matrix2D): Matrix2D {
    if (this.rows !== other.rows) {
      throw new Error(
        "Matrices must have the same number of rows for horizontal concatenation"
      );
    }

    const rows = this.rows;
    const cols = this.cols + other.cols;
    const result = new Float64Array(rows * cols);

    for (let i = 0; i < rows; i++) {
      const rowOffsetThis = i * this.cols;
      const rowOffsetOther = i * other.cols;
      const rowOffsetResult = i * cols;

      for (let j = 0; j < this.cols; j++) {
        result[rowOffsetResult + j] = this.data[rowOffsetThis + j];
      }

      for (let j = 0; j < other.cols; j++) {
        result[rowOffsetResult + this.cols + j] =
          other.data[rowOffsetOther + j];
      }
    }

    return new Matrix2D(result, rows, cols);
  }

  concatVertical(other: Matrix2D): Matrix2D {
    if (this.cols !== other.cols) {
      throw new Error(
        "Matrices must have the same number of columns for vertical concatenation"
      );
    }

    const rows = this.rows + other.rows;
    const cols = this.cols;
    const result = new Float64Array(rows * cols);

    result.set(this.data, 0);

    result.set(other.data, this.data.length);

    return new Matrix2D(result, rows, cols);
  }

  getRank(epsilon = 1e-10): number {
    const m = this.rows;
    const n = this.cols;
    const A = new Float64Array(this.data);
    let rank = 0;

    const usedRows = new Set<number>();

    for (let col = 0; col < n; col++) {
      let pivotRow = -1;
      for (let row = 0; row < m; row++) {
        if (!usedRows.has(row) && Math.abs(A[row * n + col]) > epsilon) {
          pivotRow = row;
          break;
        }
      }

      if (pivotRow === -1) continue;

      usedRows.add(pivotRow);
      rank++;

      for (let row = 0; row < m; row++) {
        if (row === pivotRow) continue;

        const factor = A[row * n + col] / A[pivotRow * n + col];
        for (let k = col; k < n; k++) {
          A[row * n + k] -= factor * A[pivotRow * n + k];
        }
      }
    }

    return rank;
  }

  getRow(i: number): Series {
    const { cols, data } = this;
    const result = new Float64Array(cols);
    const offset = i * cols;

    for (let j = 0; j < cols; j++) {
      result[j] = data[offset + j];
    }

    return new Series(result);
  }

  getColumn(j: number): Series {
    const { rows, cols } = this;
    const a = this.data;
    const result = new Float64Array(rows);
    for (let i = 0; i < rows; i++) {
      result[i] = a[i * cols + j];
    }
    return new Series(result);
  }

  cov(): Matrix2D {
    const n = this.rows;
    const d = this.cols;
    const cov = new Float64Array(d * d);
    const columns: Series[] = [];

    for (let j = 0; j < d; j++) {
      columns.push(this.getColumn(j));
    }

    const means = columns.map((col) => col.aMean());

    for (let i = 0; i < d; i++) {
      for (let j = i; j < d; j++) {
        const covIJ =
          sum([columns[i], columns[j]], (k, xi, xj) => {
            return (xi.data[k] - means[i]) * (xj.data[k] - means[j]);
          }) /
          (n - 1);

        cov[i * d + j] = covIJ;
        cov[j * d + i] = covIJ;
      }
    }

    return new Matrix2D(cov, d, d);
  }

  corr(): Matrix2D {
    const cov = this.cov();
    const d = cov.rows;
    const data = cov.data;
    const corr = new Float64Array(d * d);

    const std = new Float64Array(d);
    for (let i = 0; i < d; i++) {
      std[i] = Math.sqrt(data[i * d + i]);
    }

    for (let i = 0; i < d; i++) {
      for (let j = i; j < d; j++) {
        const denom = std[i] * std[j];
        const corrIJ = denom !== 0 ? data[i * d + j] / denom : 0;
        corr[i * d + j] = corrIJ;
        corr[j * d + i] = corrIJ;
      }
    }

    return new Matrix2D(corr, d, d);
  }
}
