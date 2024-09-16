import { Matrix2D } from "../src/matrix";
import { round } from "../src/utils/mathUtils";
import { yes, no } from "./helper";

const subject = new Matrix2D([
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 0],
]);

export function matrixTest() {
  no(
    "clone",
    (() => {
      let a = subject.clone();
      a.updateValue(0, 0, 6969);
      return a.data[0][0];
    })(),
    subject.data[0][0]
  );
  yes("determinant", subject.det(), 27);
  yes(
    "inverse",
    (round((subject.inverse()?.data[0][0] as number) * 1000) / 1000) as number,
    -1.778
  );
  yes(
    "isOrthogonal",
    new Matrix2D([
      [1, 0],
      [0, 1],
    ]).inverse() as Matrix2D,
    new Matrix2D([
      [1, 0],
      [0, 1],
    ]).transpose()
  );
  yes("exp", subject.exp(4).data[0][0], 3861);
  yes(
    "stripCol",
    subject.stripCol(1),
    new Matrix2D([
      [1, 3],
      [4, 6],
      [7, 0],
    ])
  );
  yes(
    "stripRow",
    subject.stripRow(1),
    new Matrix2D([
      [1, 2, 3],
      [7, 8, 0],
    ])
  );
  yes("stripColIn", subject.stripColIn(1), subject);
  yes("stripRowIn", subject.stripRowIn(1), subject);
  yes(
    "replaceCol",
    subject.replaceCol(1, [4, 0]),
    new Matrix2D([
      [1, 4],
      [7, 0],
    ])
  );
  yes(
    "replaceRow",
    subject.replaceRow(1, [6, 9]),
    new Matrix2D([
      [1, 3],
      [6, 9],
    ])
  );
  yes("replaceColIn", subject.replaceColIn(1, [4, 0]), subject);
  yes("replaceRowIn", subject.replaceRowIn(1, [2, 2]), subject);
  yes(
    "add",
    subject.add(subject),
    new Matrix2D([
      [2, 8],
      [4, 4],
    ])
  );
  yes("addIn", subject.addIn(subject), subject);
  yes(
    "matMultiply",
    subject.matMultiply(
      new Matrix2D([
        [4, 5],
        [4, 5],
      ])
    ),
    new Matrix2D([
      [40, 50],
      [32, 40],
    ])
  );
}