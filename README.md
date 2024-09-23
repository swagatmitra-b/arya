# Arya

## A mini numerical-computation library

This library is an extended offshoot of a physics engine that's currently under development and is still at its nascent phase, so expect frequent updates!

### Usage

You can perform matrix calculations

```typescript
import { Matrix2D } from "arya-math";

const a = new Matrix2D([
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 0],
]);

const determinant = a.det(); // 27

const chainedVal = a.inverse()?.scalarAdd(3).transpose().det(); // 4.037
```

solve a system of linear equations

```typescript
import { Cramer } from "arya-math";

const system = new Cramer([
  [7, 1, -5, -1], // 7x + y - 5 = -1
  [4, 3, 1, 0], // 5x + 3y + 1 = 0
  [6, 9, -2, 8], // 6x + 9y - 2 = 8
]);

const solution = system.solve();
// x: -0.79,
// y: 1.27,
// z: -0.65,
```

evaluate algebraic expressions

```typescript
import { evaluateExp } from "arya-math";

const result = evaluateExp(
  {
    x: 2,
    y: 3,
  },
  "2x + y(2x^y + yx) + 8y(y+2)"
);

console.log(result); // 190
```

or play around with Vectors!

```typescript
import { Vector3 } from "arya-math";

const vec = new Vector3(2, 3, 4);

const transformation = vec.scale(3).cross(new Vector3(3, 5, 0)).length(); // 70.035
```

Please feel free to report any bugs or contribute. Thanks! :)
