import { yes } from "./helper";
import { parseP, evaluateExp } from "../src/postfix";

export function postfixTest() {
  yes("1", parseP("A+B*C-D"), "ABC*+D-");
  yes("2", parseP("a+b*(c^d-e)^(f+g*h)-i"), "abcd^e-fgh*+^*+i-");
  yes("3", parseP("(A+B)*C-D/(E+F*G)"), "AB+C*DEFG*+/-");
  yes("4", parseP("A*(B+(C/D))"), "ABCD/+*");
  yes("5", parseP("A/B+(C-D)*E"), "AB/CD-E*+");
}

export function evalPostFixTest() {
  yes(
    "1",
    evaluateExp(
      {
        A: 1,
        B: 2,
        C: 3,
        D: 4,
      },
      "A+B*C-D"
    ),
    3
  );
  yes(
    "2",
    evaluateExp(
      {
        A: 2,
        B: 3,
        C: 4,
        D: 6,
      },
      "A*(B+(C/D))"
    ),
    7.33
  );
  yes(
    "3",
    evaluateExp(
      {
        A: 2,
        B: 4,
        C: 5,
        D: 1,
        E: 6,
        F: 0,
      },
      "A/B+(C-D)*E^(F-2*3)+3*8"
    ),
    24.5
  );
  yes(
    "4",
    evaluateExp(
      {
        x: 2,
        y: 3,
      },
      "2x + y(2x^y + yx) + 8y(y+2)"
    ),
    190
  );
}
