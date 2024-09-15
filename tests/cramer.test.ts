import { Cramer, CramerType } from "../src/cramer";
import { yes } from "./helper";

const twoVar = new Cramer([
  [1, 3, -4],
  [2, 8, 5],
]);

const threeVar = new Cramer([
  [7, 1, -5, -1],
  [4, 3, 1, 0],
  [6, 9, -2, 8],
]);

export function cramerTest() {
  yes("twoVar", twoVar.solve() as CramerType, {
    result: "Unique Solution",
    x: 23.5,
    y: -6.5,
  });
  yes("threeVar", threeVar.solve() as CramerType, {
    result: "Unique Solution",
    x: -0.79,
    y: 1.27,
    z: -0.65,
  });
}
