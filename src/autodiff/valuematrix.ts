import Value from "./engine";

export class ValueMatrix {
  readonly rows: number;
  readonly cols: number;
  readonly data: Value[];

  constructor(data: Value[], rows: number, cols: number) {
    if (data.length !== rows * cols) {
      throw new Error(
        `Data length (${data.length}) does not match matrix size (${rows}x${cols})`
      );
    }
    this.data = data;
    this.rows = rows;
    this.cols = cols;
  }

  static zeros(rows: number, cols: number): ValueMatrix {
    const data: Value[] = Array.from(
      { length: rows * cols },
      () => new Value(0)
    );
    return new ValueMatrix(data, rows, cols);
  }

  at(r: number, c: number): Value {
    return this.data[r * this.cols + c];
  }

  set(r: number, c: number, v: Value): void {
    this.data[r * this.cols + c] = v;
  }

  add(other: ValueMatrix): ValueMatrix {
    if (this.rows !== other.rows || this.cols !== other.cols) {
      throw new Error("Matrix dimension mismatch in add()");
    }
    const result = this.data.map((v, i) => v.add(other.data[i]));
    return new ValueMatrix(result, this.rows, this.cols);
  }

  mul(other: ValueMatrix): ValueMatrix {
    if (this.cols !== other.rows) {
      throw new Error("Matrix dimension mismatch in mul");
    }

    const resRows = this.rows;
    const resCols = other.cols;
    const aCols = this.cols;
    const result = new Array<Value>(resRows * resCols);
    const aData = this.data;
    const bData = other.data;

    for (let r = 0; r < resRows; r++) {
      const aRowOffset = r * aCols;
      for (let c = 0; c < resCols; c++) {
        let sum = new Value(0);
        for (let k = 0; k < aCols; k++) {
          sum = sum.add(aData[aRowOffset + k].mul(bData[k * resCols + c]));
        }
        result[r * resCols + c] = sum;
      }
    }

    return new ValueMatrix(result, resRows, resCols);
  }

  map(fn: (v: Value) => Value): ValueMatrix {
    return new ValueMatrix(this.data.map(fn), this.rows, this.cols);
  }
}
