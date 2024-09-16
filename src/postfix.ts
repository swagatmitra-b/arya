import { pow, round } from "./utils/mathUtils";
const precedence: Record<string, number> = {
  "^": 3,
  "*": 2,
  "/": 2,
  "+": 1,
  "-": 1,
};

const isRightAssociative = (op: string) => op == "^";
const operators = Object.keys(precedence);

export function parseP(s: string) {
  let output = "";
  let opStack = [];

  for (let i = 0; i < s.length; i++) {
    let token = s[i];
    if (!operators.includes(token) && token != "(" && token != ")")
      output += token;
    else if (token == "(") opStack.push(token);
    else if (token == ")") {
      while (opStack.length && opStack[opStack.length - 1] != "(") {
        output += opStack.pop();
      }
      opStack.pop();
    } else if (operators.includes(token)) {
      if (
        !opStack.length ||
        opStack[opStack.length - 1] == "(" ||
        precedence[token] > precedence[opStack[opStack.length - 1]] ||
        (precedence[token] == precedence[opStack[opStack.length - 1]] &&
          isRightAssociative(token))
      )
        opStack.push(token);
      else {
        while (
          precedence[token] < precedence[opStack[opStack.length - 1]] ||
          (precedence[token] == precedence[opStack[opStack.length - 1]] &&
            !isRightAssociative(token))
        ) {
          output += opStack.pop();
        }
        opStack.push(token);
      }
    }
  }
  while (opStack.length) {
    output += opStack.pop();
  }

  return output;
}

export function evaluateExp(vals: Record<string, number>, s: string): number {
  s = fixString(s);
  const pf = parseP(s);
  let stack = [];
  for (let i = 0; i < pf.length; i++) {
    let token = pf[i];
    if (operators.includes(token)) {
      let first: number | string = stack.pop() as string;
      let second: number | string = stack.pop() as string;
      if (!parseFloat(first)) first = vals[first];
      else first = parseFloat(first);
      if (!parseFloat(second)) second = vals[second];
      else second = parseFloat(second);
      switch (token) {
        case "*":
          stack.push(second * first);
          break;
        case "/":
          stack.push(second / first);
          break;
        case "+":
          stack.push(second + first);
          break;
        case "-":
          stack.push(second - first);
          break;
        case "^":
          stack.push(pow(second, first));
          break;
        default:
          throw Error("Operator not recognized");
      }
    } else stack.push(token);
  }
  return round((stack.pop() as number) * 100) / 100;
}

const isChar = (s: string, i: number) =>
  !operators.includes(s[i]) && s[i] != "(" && s[i] != ")";

const satisfyNum = (s: string, si: number, ti: number) =>
  isNaN(parseFloat(s[si])) || isNaN(parseFloat(s[ti]));

function fixString(s: string) {
  s = [...s].filter((str) => str != " ").join("");
  let positions = new Set<number>();

  for (let i = 0; i < s.length; i++) {
    if (isChar(s, i)) {
      if (i == 0) {
        if (
          !operators.includes(s[i + 1]) &&
          s[i + 1] != ")" &&
          satisfyNum(s, i, i + 1)
        ) {
          positions.add(i + 1);
        }
      } else if (i == s.length - 1) {
        if (
          !operators.includes(s[i - 1]) &&
          s[i - 1] != "(" &&
          satisfyNum(s, i, i - 1)
        ) {
          positions.add(i);
        }
      } else {
        if (
          !operators.includes(s[i + 1]) &&
          s[i + 1] != ")" &&
          satisfyNum(s, i, i + 1)
        ) {
          positions.add(i + 1);
        }
        if (
          !operators.includes(s[i - 1]) &&
          s[i - 1] != "(" &&
          satisfyNum(s, i, i - 1)
        ) {
          positions.add(i);
        }
      }
    }
  }
  return applyString(s, positions);
}

function applyString(s: string, positions: Set<number>) {
  let indices = Array.from(positions.values()).sort((a, b) => a - b);
  let b = [...s];
  let len = b.length;
  for (let i = 0; i < indices.length; i++) {
    b.splice(b.length - len + indices[i], 0, "*");
  }
  return b.join("");
}