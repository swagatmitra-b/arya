## Arya

### A mini numerical-computation library

This library is an offshoot of a physics engine that's currently under development and is still at its nascent phase, so expect frequent updates!

#### Usage

You can perform matrix calculations

```typescript
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
const system = new Cramer([
  [7, 1, -5, -1], // 7x + y - 5 = -1
  [4, 3, 1, 0], // 4x + 3y + 1 = 0
  [6, 9, -2, 8], // 6x + 9y - 2 = 8
]);

const solution = system.solve();
// x: -0.79,
// y: 1.27,
// z: -0.65,
```

or play around with Vectors!

```typescript
const vec = new Vector3(2, 3, 4);

const transformation = vec.scale(3).cross(new Vector3(3, 5, 0)).length(); // 70.035
```
 Please feel free to contribute. Thanks! :)
