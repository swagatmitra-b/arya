function deepEqual(a: any, b: any): boolean {
  if (typeof a === "number" && typeof b === "number") {
    return Math.abs(a - b) < 1e-3; // tolerance 
  }
  if (typeof a !== typeof b || a === null || b === null) return a === b;
  if (Array.isArray(a) && Array.isArray(b)) {
    return a.length === b.length && a.every((v, i) => deepEqual(v, b[i]));
  }
  if (typeof a === "object" && typeof b === "object") {
    const keysA = Object.keys(a);
    const keysB = Object.keys(b);
    if (keysA.length !== keysB.length) return false;
    return keysA.every((k) => deepEqual(a[k], b[k]));
  }
  return a === b;
}

export function yes(label: string, result: any, expectedVal: any): true {
  if (deepEqual(result, expectedVal)) return true;
  throw new Error(
    `❌ Test failed for ${label}\nExpected: ${JSON.stringify(
      expectedVal
    )}\nGot: ${JSON.stringify(result)}`
  );
}

export function no(label: string, result: any, expectedVal: any): true {
  if (!deepEqual(result, expectedVal)) return true;
  throw new Error(
    `❌ Test failed for ${label}\n Did NOT Expect: ${JSON.stringify(
      expectedVal
    )}\nGot: ${JSON.stringify(result)}`
  );
}