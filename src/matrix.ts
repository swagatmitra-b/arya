import { pow, round } from "./utils/mathUtils";
import { Cramer } from "./cramer";
import { Vector2, Vector3 } from "./vector";
import { Series } from "./series";
import { sum } from "./utils/mathUtils";

export class Matrix2D {
  /**
   * The number of rows in the matrix
   */

  rows: number;

  /**
   * The number of columns in the matrix
   */

  cols: number;

  /**
   * The plain 2D Array representation of the matrix
   */

  private _raw: number[][];

  /**
   * The `Float32Array` repsentation of the matrix
   */

  private _data: Float32Array[];

  constructor(
    private values: number[][] = [
      [1, 0, 0],
      [0, 1, 0],
      [0, 0, 1],
    ]
  ) {
    this._raw = values;
    this._data = this.toTyped(values);
    this.rows = this._data.length;
    this.cols = this._data[0].length;
  }

  private toTyped(vals: number[][]) {
    let newData: Float32Array[] = [];
    for (let i = 0; i < vals.length; i++) {
      let row = new Float32Array(vals[i]);
      newData.push(row);
    }
    return newData;
  }

  /**
   * The plain 2D Array representation of the matrix
   */

  get raw() {
    return this.clone()._raw;
  }

  /**
   * The `Float32Array` repsentation of the matrix
   */

  get data() {
    return this.clone()._data;
  }

  /**
   * Dimensions of the matrix
   * @returns A tuple consisting of the number of rows and columns in this matrix
   */

  dim(): [number, number] {
    return [this.rows, this.cols];
  }

  /**
   * Creates a deep copy of this matrix
   * @returns A new `Matrix2D` object
   */

  clone() {
    return new Matrix2D(JSON.parse(JSON.stringify(this.values)));
  }

  /**
   * Adds this matrix with another matrix
   * @param mat The matrix to be added
   * @returns A new `Matrix2D` with transformed elments
   */

  add(mat: Matrix2D) {
    if (this.cols != mat.cols || this.rows != mat.rows)
      throw Error("Matrices cannot be added");
    this._raw = [];
    for (let i = 0; i < this.rows; i++) {
      let row: number[] = [];
      for (let j = 0; j < this.cols; j++)
        row.push(this._data[i][j] + mat.data[i][j]);
      this._raw.push(row);
    }

    return new Matrix2D(this._raw);
  }

  addIn(mat: Matrix2D) {
    if (this.cols != mat.cols || this.rows != mat.rows)
      throw Error("Matrices cannot be added");
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this._data[i][j] += mat.data[i][j];
        this.values[i][j] += mat.values[i][j];
      }
    }
    return this;
  }

  /**
   * Subtracts another matrix from this matrix
   * @param mat The matrix to be subtracted
   * @returns A new `Matrix2D` object with transformed elments
   */

  sub(mat: Matrix2D) {
    if (this.cols != mat.cols || this.rows != mat.rows)
      throw Error("Matrices cannot be subtracted");
    this._raw = [];
    for (let i = 0; i < this.rows; i++) {
      let row: number[] = [];
      for (let j = 0; j < this.cols; j++)
        row.push(this._data[i][j] - mat.data[i][j]);
      this._raw.push(row);
    }

    return new Matrix2D(this._raw);
  }

  subIn(mat: Matrix2D) {
    if (this.cols != mat.cols || this.rows != mat.rows)
      throw Error("Matrices cannot be added");
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this._data[i][j] -= mat.data[i][j];
        this.values[i][j] -= mat.values[i][j];
      }
    }
    return this;
  }

  /**
   * Adds a scalar value to each element of the matrix
   * @param val A scalar value
   * @returns A new `Matrix2D` object with transformed elments
   */

  scalarAdd(val: number) {
    this._raw = [];
    for (let i = 0; i < this.rows; i++) {
      let row: number[] = [];
      for (let j = 0; j < this.cols; j++) row.push(this._data[i][j] + val);
      this._raw.push(row);
    }

    return new Matrix2D(this._raw);
  }

  scalarAddIn(val: number) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this._data[i][j] += val;
        this.values[i][j] += val;
      }
    }
    return this;
  }

  /**
   * Multiplies a scalar value to each element of this matrix
   * @param mat A scalar value
   * @returns A new `Matrix2D` object with transformed elments
   */

  scalarMul(val: number) {
    this._raw = [];
    for (let i = 0; i < this.rows; i++) {
      let row: number[] = [];
      for (let j = 0; j < this.cols; j++) row.push(this._data[i][j] * val);
      this._raw.push(row);
    }

    return new Matrix2D(this._raw);
  }

  scalarMulIn(val: number) {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this._data[i][j] *= val;
        this.values[i][j] *= val;
      }
    }
    return this;
  }

  /**
   * Matrix multiplication
   * @param mat The matrix to be multiplied with
   * @returns A new `Matrix2D` object with transformed elments
   */

  matMultiply(mat: Matrix2D) {
    if (this.cols != mat.rows) throw Error("Matrices are not comformable");
    this._raw = [];
    for (let i = 0; i < this.rows; i++) {
      let row: number[] = [];
      for (let k = 0; k < mat.cols; k++) {
        let val = 0;
        for (let j = 0; j < this.cols; j++) {
          val += this._data[i][j] * mat.data[j][k];
        }
        row.push(val);
      }
      this._raw.push(row);
    }
    return new Matrix2D(this._raw);
  }

  /**
   * Gets the transpose of this matrix
   * @returns A new `Matrix2D` object
   */

  transpose() {
    this._raw = [];
    for (let i = 0; i < this.cols; i++) {
      let row: number[] = [];
      for (let j = 0; j < this.rows; j++) {
        row.push(this._data[j][i]);
      }
      this._raw.push(row);
    }

    return new Matrix2D(this._raw);
  }

  transposeIn() {
    for (let i = 0; i < this.cols; i++) {
      for (let j = 0; j < this.rows; j++) {
        this._data[i][j] = this._data[j][i];
        this.values[i][j] = this.values[j][i];
      }
    }
    return this;
  }

  /**
   * Converts the matrix to a `Vector2` object
   * @returns A `Vector2` object
   */

  toVector2() {
    if (this._data[0].length > 1) throw Error("Matrix is not linear");
    return new Vector2(this._data[0][0], this._data[1][0]);
  }

  /**
   * Converts the matrix to a `Vector3` object
   * @returns A `Vector3` object
   */

  toVector3() {
    if (this._data[0].length > 1) throw Error("Matrix is not linear");
    return new Vector3(this._data[0][0], this._data[1][0], this._data[2][0]);
  }

  /**
   * The trace of the matrix
   * @returns A scalar value
   */

  trace() {
    let trace = 0;
    for (let i = 0; i < this.rows; i++) {
      trace += this._data[i][i];
    }
    return trace;
  }

  private calcMinor(mat: Matrix2D) {
    return mat.data[0][0] * mat.data[1][1] - mat.data[1][0] * mat.data[0][1];
  }

  /**
   * Gets the minor matrix of a matrix
   * @param row The row index of the element
   * @param col The column index of the element
   * @param mat The matrix, defaults to `this`
   * @returns A `Vector3` object
   */

  getMinorMatrix(row: number, col: number, mat: Matrix2D = this) {
    this._raw = [];
    for (let i = 0; i < mat.rows; i++) {
      let rowMatrix: number[] = [];
      for (let j = 0; j < mat.cols; j++) {
        if (i != row && j != col) rowMatrix.push(mat.data[i][j]);
      }
      if (rowMatrix.length) this._raw.push(rowMatrix);
    }
    return new Matrix2D(this._raw);
  }

  /**
   * The determinant of the matrix
   * @param mat The matrix, defaults to this
   * @returns A scalar value
   */

  det(mat: Matrix2D = this) {
    let val = 0;
    let [rows, cols] = mat.dim();
    if (rows != cols) throw Error("Not a square matrix");
    if (rows == 1 && cols == 1) return mat.data[0][0];
    if (rows == 2 && cols == 2) return this.calcMinor(mat);
    for (let i = 0; i < mat.cols; i++) {
      let minorMat = this.getMinorMatrix(0, i, mat);
      let [rows, cols] = minorMat.dim();
      if (rows == 2 && cols == 2)
        val += mat.data[0][i] * this.calcMinor(minorMat) * pow(-1, i);
      else {
        let newVal = this.det(minorMat);
        val += mat.data[0][i] * newVal * pow(-1, i);
      }
    }
    return round(val * 1000) / 1000;
  }

  /**
   * The adjoint of a matrix
   * @param mat The matrix, defaults to this
   * @returns A new `Matrix2D` object
   */

  getAdjoint(mat: Matrix2D = this) {
    let cofactorMatrix: number[][] = [];

    for (let i = 0; i < mat.rows; i++) {
      let row: number[] = [];
      for (let j = 0; j < mat.cols; j++) {
        let minor = this.det(this.getMinorMatrix(i, j, mat));
        row.push(minor * pow(-1, i + j));
      }
      cofactorMatrix.push(row);
    }

    return new Matrix2D(cofactorMatrix).transpose();
  }

  /**
   * The inverse of a matrix
   * @returns A new `Matrix2D` object if the inverse exists, else `null`
   */

  inverse() {
    if (this.det(this) == 0) {
      return null;
    }
    return this.getAdjoint().scalarMul(1 / this.det(this));
  }

  /**
   * Raises the matrix to a power
   * @param power The exponent
   * @returns A new `Matrix2D` object
   */

  exp(power: number) {
    let res = new Matrix2D(this.values);
    for (let i = 0; i < power - 1; i++) res = res.matMultiply(this);
    return res;
  }

  expIn(power: number) {
    let res = new Matrix2D(this.values);
    for (let i = 0; i < power; i++) res = res.matMultiply(this);
    this._data = this.toTyped(res._raw);
    this.values = res._raw;
    return this;
  }

  /**
   * Deletes a column from the matrix
   * @param idx The index of the column (0-based index)
   * @returns A new Column
   */

  getCol(idx: number) {
    let clone = this.clone();
    let col = [];
    for (let i = 0; i < this.rows; i++) {
      col.push(clone._raw[i].splice(idx, 1)[0]);
    }
    return new Series(col);
  }

  /**
   * Deletes a column from the matrix
   * @param idx The index of the column (0-based index)
   * @returns A new `Matrix2D` object
   */

  stripCol(idx: number) {
    let clone = this.clone();
    for (let i = 0; i < this.rows; i++) {
      clone._raw[i].splice(idx, 1);
    }
    return new Matrix2D(clone._raw);
  }

  stripColIn(idx: number) {
    let clone = this.clone();
    for (let i = 0; i < this.rows; i++) {
      clone._raw[i].splice(idx, 1);
    }
    this._data = this.toTyped(clone._raw);
    this.values = clone._raw;
    this.cols -= 1;
    return this;
  }

  /**
   * Deletes a row from the matrix
   * @param idx The index of the row (0-based index)
   * @returns A new `Matrix2D` object
   */

  stripRow(idx: number) {
    let clone = this.clone();
    clone._raw.splice(idx, 1);
    return new Matrix2D(clone._raw);
  }

  stripRowIn(idx: number) {
    let clone = this.clone();
    clone._raw.splice(idx, 1);
    this._data = this.toTyped(clone._raw);
    this.values = clone._raw;
    this.rows -= 1;
    return this;
  }

  /**
   * Updates an element of the matrix
   * @param i The index of the row (0-based index)
   * @param j The index of the column (0-based index)
   * @param val The new value
   * @returns The original matrix
   */

  updateValue(i: number, j: number, val: number) {
    this._raw = this.values;
    this._data[i][j] = val;
    this._raw[i][j] = val;
    return this;
  }

  /**
   * Concatenates two matrices
   * @param mat The matrix to be concatenated with
   * @param axis A binary value of 0 or 1.
   * 0 represents concatenating horizontally while 1 represents concatenating vertically.
   * @returns A new `Matrix2D` object
   *
   * @example
   *         [        [                     [
   * [0, 1, 2],  [3, 4],      [0, 1, 2, 3, 4],
   * [5, 6, 7] + [8, 9]   =>  [5, 6, 7, 8, 9]   (axis = 0)
   * ]           ]            ]
   *
   *         [           [               [
   * [0, 1, 2],  [3, 4, 5],      [0, 1, 2],
   * [5, 6, 7] + ]           =>  [5, 6, 7],   (axis = 1)
   * ]                           [3, 4, 5]
   *                            ]
   *
   */

  concat(mat: Matrix2D, axis: number) {
    const [r1, c1] = this.dim();
    const [r2, c2] = mat.dim();

    if (axis == 0) {
      if (r1 != r2)
        throw Error(
          `${r1}x${c1} and ${r2}x${c2} matrices cannot be concatenated in this axis`
        );
      this._raw = [];
      for (let i = 0; i < this.rows; i++) {
        let row: number[] = [];
        for (let j = 0; j < this.cols + mat.cols; j++) {
          if (j < this.cols) row.push(this.data[i][j]);
          else row.push(mat.data[i][j - this.cols]);
        }
        this._raw.push(row);
      }
      return new Matrix2D(this._raw);
    } else if (axis == 1) {
      if (c1 != c2)
        throw Error(
          `${r1}x${c1} and ${r2}x${c2} matrices cannot be concatenated in this axis`
        );
      this._raw = [];
      for (let i = 0; i < this.rows + mat.rows; i++) {
        let row: number[] = [];
        for (let j = 0; j < this.cols; j++) {
          if (i < this.rows) row.push(this._data[i][j]);
          else row.push(mat.data[i - this.rows][j]);
        }
        this._raw.push(row);
      }
      return new Matrix2D(this._raw);
    }
  }

  /**
   * Replaces a column of the matrix with a new set of values
   * @param idx The index of the target column (0-based index)
   * @param _data An array consisting of the new values
   * @returns A new `Matrix2D` object
   */

  replaceCol(idx: number, data: number[]) {
    let raw = this.clone().raw;
    for (let i = 0; i < this.rows; i++) {
      raw[i][idx] = data[i];
    }
    return new Matrix2D(raw);
  }

  replaceColIn(idx: number, data: number[]) {
    let raw = this.clone().raw;
    for (let i = 0; i < this.rows; i++) {
      raw[i][idx] = data[i];
    }
    this._data = this.toTyped(raw);
    this.values = raw;
    return this;
  }

  /**
   * Replaces a row of the matrix with a new set of values
   * @param idx The index of the target row (0-based index)
   * @param _data An array consisting of the new values
   * @returns A new `Matrix2D` object
   */

  replaceRow(idx: number, data: number[]) {
    let raw = this.clone()._raw;
    for (let i = 0; i < this.rows; i++) {
      raw[idx][i] = data[i];
    }
    return new Matrix2D(raw);
  }

  replaceRowIn(idx: number, data: number[]) {
    let raw = this.clone()._raw;
    for (let i = 0; i < this.rows; i++) {
      raw[idx][i] = data[i];
    }
    this._data = this.toTyped(raw);
    this.values = raw;
    return this;
  }

  /**
   * Checks whether two matrices are equal
   * @param mat A `Matrix2D` object
   */

  isEqual(mat: Matrix2D) {
    if (this.rows != mat.rows || this.cols != mat.cols)
      throw Error("Dimensions do not match");
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (this._data[i][j] != mat.data[i][j]) return false;
      }
    }
    return true;
  }

  /**
   * Checks the orthogonality of the matrix
   * @returns A `boolean`
   */

  isOrthogonal() {
    const inv = this.inverse();
    if (inv) {
      if (inv.isEqual(this.transpose())) return true;
    }
    return false;
  }

  /**
   * Converts the matrix to a Cramer object
   * @returns A new `Cramer` object
   */

  private checkSubmatrices(size: number, currSize: number) {
    for (let i = 0; i < size - currSize + 1; i++) {
      for (let j = 0; j < size - currSize + 1; j++) {
        let matrix: number[][] = [];
        for (let x = 0; x < currSize; x++) {
          let row: number[] = [];
          for (let y = 0; y < currSize; y++) {
            row.push(this._data[x + i][y + j]);
          }
          matrix.push(row);
        }
        const a = new Matrix2D(matrix);
        if (a.det() != 0) return currSize;
      }
    }
    return 0;
  }

  /**
   * The Rank of a matrix
   */

  getRank(currSize = this.dim()[0] - 1): number {
    const [rows, cols] = this.dim();
    if (rows != cols) throw Error("Not a square matrix");
    if (this.det() != 0) return rows;
    const a = this.checkSubmatrices(rows, currSize);
    if (a) return a;
    else if (a == 0 && currSize == 1) return 0;
    else return this.getRank(currSize - 1);
  }

  /**
   * Convert the matrix (2x3 or 3x4) to a `Cramer` object
   * @returns A `Cramer` object
   */

  toCramer() {
    return new Cramer(this.values);
  }

  /**
   * Get the covariance matrix with respect to another matrix
   * @param mat The second matrix
   * @returns A new `Matrix2D` object
   */

  cov(mat: Matrix2D) {
    let matrix: number[][] = [];
    for (let i = 0; i < this.cols; i++) {
      matrix.push([]);
      for (let j = 0; j < this.cols; j++) {
        let aCol = this.getCol(i);
        let bCol = mat.getCol(j);
        let covSum = sum(
          [aCol, bCol],
          (k, a, b) => (a.data[k] - aCol.aMean()) * (b.data[k] - bCol.aMean())
        );
        matrix[i].push(covSum / (aCol.size - 1));
      }
    }
    return new Matrix2D(matrix);
  }

  corr(mat: Matrix2D) {
    let matrix: number[][] = [];
    for (let i = 0; i < this.cols; i++) {
      matrix.push([]);
      for (let j = 0; j < this.cols; j++) {
        let aCol = this.getCol(i);
        let bCol = mat.getCol(j);
        let aStd = Math.sqrt(
          sum(
            [aCol],
            (i, a) => Math.pow(a.data[i] - aCol.aMean(), 2) / (aCol.size - 1)
          )
        );
        let bStd = Math.sqrt(
          sum(
            [bCol],
            (i, b) => Math.pow(b.data[i] - bCol.aMean(), 2) / (bCol.size - 1)
          )
        );
        let cov =
          sum(
            [aCol, bCol],
            (k, a, b) => (a.data[k] - aCol.aMean()) * (b.data[k] - bCol.aMean())
          ) /
          (aCol.size - 1);

        matrix[i].push(cov / (aStd * bStd));
      }
    }
    return new Matrix2D(matrix);
  }
}
