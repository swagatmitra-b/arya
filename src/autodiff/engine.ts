class Value {
  value: number;
  grad: number = 0;
  back: () => void = () => {};
  parents: Value[] = [];

  constructor(value: number) {
    this.value = value;
  }

  add(other: Value | number) {
    if (typeof other == "number") other = new Value(other);
    const out = new Value(this.value + other.value);
    out.parents = [this, other];
    out.back = () => {
      this.grad += out.grad;
      other.grad += out.grad;
    };
    return out;
  }

  neg(): Value {
    const out = new Value(-this.value);
    out.parents = [this];
    out.back = () => {
      this.grad += -1 * out.grad;
    };
    return out;
  }

  sub(other: Value | number) {
    if (typeof other === "number") other = new Value(other);
    return this.add(other.neg());
  }

  mul(other: Value | number) {
    if (typeof other === "number") other = new Value(other);
    const out = new Value(this.value * other.value);
    out.parents = [this, other];
    out.back = () => {
      this.grad += other.value * out.grad;
      other.grad += this.value * out.grad;
    };
    return out;
  }

  inv(): Value {
    const out = new Value(1 / this.value);
    out.parents = [this];
    out.back = () => {
      this.grad += (-1 / (this.value * this.value)) * out.grad;
    };
    return out;
  }

  div(other: Value | number) {
    if (typeof other === "number") other = new Value(other);
    return this.mul(other.inv());
  }

  pow(other: number) {
    const out = new Value(Math.pow(this.value, other));
    out.parents = [this];
    out.back = () => {
      this.grad += other * Math.pow(this.value, other - 1) * out.grad;
    };
    return out;
  }

  relu() {
    const out = new Value(this.value > 0 ? this.value : 0);
    out.parents = [this];
    out.back = () => {
      this.grad += (this.value > 0 ? 1 : 0) * out.grad;
    };
    return out;
  }

  tanh() {
    const t = Math.tanh(this.value);
    const out = new Value(t);
    out.parents = [this];
    out.back = () => {
      this.grad += (1 - t * t) * out.grad;
    };
    return out;
  }

  sigmoid(): Value {
    const out = new Value(1 / (1 + Math.exp(-this.value)));
    out.parents = [this];
    out.back = () => {
      const sig = out.value;
      this.grad += sig * (1 - sig) * out.grad;
    };
    return out;
  }

  exp() {
    const out = new Value(Math.exp(this.value));
    out.parents = [this];
    out.back = () => {
      this.grad += out.value * out.grad;
    };
    return out;
  }

  log() {
    const out = new Value(Math.log(this.value));
    out.parents = [this];
    out.back = () => {
      this.grad += (1 / this.value) * out.grad;
    };
    return out;
  }

  zeroGrad() {
    this.grad = 0;
  }

  backward(finalOp: Value) {
    const visited = new Set<Value>();
    const order: Value[] = [];

    function toposort(node: Value) {
      visited.add(node);
      for (const parent of node.parents) {
        if (!visited.has(parent)) {
          toposort(parent);
        }
      }
      order.push(node);
    }
    toposort(finalOp);
    finalOp.grad = 1;
    return order.reverse().forEach((v) => v.back());
  }
}

export default Value;
