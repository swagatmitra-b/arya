import Value from "./engine";
import { ValueMatrix } from "./valuematrix";

// interface NeuronOptions {
// init?: "xavier" | "he" | "normal";
// }

type ActivationFn = "reLu" | "tanh" | "sigmoid";

class Neuron {
  activation: ActivationFn;
  weights: ValueMatrix;
  bias: Value;

  constructor(inputSize: number, activation: ActivationFn = "reLu") {
    const data: Value[] = new Array(inputSize);
    for (let i = 0; i < inputSize; i++) {
      data[i] = new Value(Math.random() * 2 - 1);
    }
    this.weights = new ValueMatrix(data, 1, inputSize);
    this.bias = new Value(0);
    this.activation = activation;
  }

  forward(x: ValueMatrix): Value {
    switch (this.activation) {
      case "reLu":
        return this.weights.mul(x).at(0, 0).add(this.bias).relu();
      case "tanh":
        return this.weights.mul(x).at(0, 0).add(this.bias).tanh();
      case "sigmoid":
        return this.weights.mul(x).at(0, 0).add(this.bias).sigmoid();
    }
  }

  params(): Value[] {
    return [...this.weights.data, this.bias];
  }
}

class Layer {
  neurons: Neuron[];

  constructor(nin: number, nout: number, activation: ActivationFn) {
    this.neurons = Array.from({ length: nout }, () => new Neuron(nin, activation));
  }

  forward(x: ValueMatrix): ValueMatrix {
    return new ValueMatrix(
      this.neurons.map((n) => n.forward(x)),
      this.neurons.length,
      1
    );
  }

  params(): Value[] {
    return this.neurons.flatMap((n) => n.params());
  }
}

export class MLP {
  layers: Layer[];

  constructor(nin: number, nouts: number[], activation: ActivationFn) {
    const sizes = [nin, ...nouts];
    this.layers = [];

    for (let i = 0; i < nouts.length; i++) {
      this.layers.push(new Layer(sizes[i], sizes[i + 1], activation));
    }
  }
  forward(x: ValueMatrix) {
    for (const layer of this.layers) {
      x = layer.forward(x);
    }
    return x;
  }

  params(): Value[] {
    return this.layers.flatMap((layer) => layer.params());
  }

  zeroGrad() {
    this.params().forEach((p) => p.zeroGrad());
  }

  step(lr: number) {
    this.params().forEach((p) => {
      p.value -= lr * p.grad;
    });
  }
}
