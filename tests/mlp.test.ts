import Value from "../src/autodiff/engine";
import { ValueMatrix } from "../src/autodiff/valuematrix";
import { MLP } from "../src/autodiff/mlp";

const data = [
  { x: [0, 0], y: [0] },
  { x: [0, 1], y: [1] },
  { x: [1, 0], y: [1] },
  { x: [1, 1], y: [0] },
];

// mlp with 2 inputs, 1 hidden layer of 4 neurons, 1 output
const mlp = new MLP(2, [4, 1], "reLu");

const epochs = 2000;
const lr = 0.01;

for (let epoch = 0; epoch < epochs; epoch++) {
  let totalLoss = 0;

  for (const { x, y } of data) {
    // input as valuematrix (2x1)
    const inputMatrix = new ValueMatrix(
      x.map((v) => new Value(v)),
      2,
      1
    );

    // forward pass
    const outMatrix = mlp.forward(inputMatrix);

    // true label -> value
    const target = new Value(y[0]);

    // pred label 
    const pred = outMatrix.at(0, 0);

    // squared loss: (pred - target)^2
    const loss = pred.sub(target).pow(2);

    // backprop
    mlp.zeroGrad(); 
    loss.backward(loss);

    // grad desc
    mlp.step(lr);

    totalLoss += loss.value;
  }

  if (epoch % 200 === 0) {
    console.log(`Epoch ${epoch}, loss: ${totalLoss.toFixed(4)}`);
  }
}

console.log("Predictions post training:");
for (const { x } of data) {
  const inputMatrix = new ValueMatrix(
    x.map((v) => new Value(v)),
    2,
    1
  );
  const outMatrix = mlp.forward(inputMatrix);
  const pred = outMatrix.at(0, 0).value;
  console.log(`${x} -> ${pred.toFixed(3)}`);
}
