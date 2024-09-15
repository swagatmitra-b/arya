export function yes<R extends E, E>(label: string, result: R, expectedVal: E) {
  if (JSON.stringify(result) == JSON.stringify(expectedVal)) return true;
  else
    throw Error(
      `Test failed for ${label} \n Expected: ${JSON.stringify(
        expectedVal
      )} \n Got: ${JSON.stringify(result)}`
    );
}

export function no<R extends E, E>(label: string, result: R, expectedVal: E) {
  if (JSON.stringify(result) != JSON.stringify(expectedVal)) return true;
  else
    throw Error(
      `Test failed for ${label} \n Did not expect: ${JSON.stringify(
        expectedVal
      )} \n Got: ${JSON.stringify(result)}`
    );
}
