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

export function evaluateP(vals: Record<string, number>, s: string): number {
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
