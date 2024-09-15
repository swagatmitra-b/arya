import { Matrix2D } from "./matrix";
import { sin, cos, sqrt, pow, atan2, acos, round } from "./utils/mathUtils";

export class Vector2 {
  constructor(public x: number = 1, public y: number = 1) {
    this.x = x;
    this.y = y;
  }

  /**
   * Creates a deep copy of the vector
   * @returns A new `Vector2` object
   */

  clone() {
    return new Vector2(this.x, this.y);
  }

  /**
   * The magnitude of the vector
   * @returns A scalar value
   */

  length() {
    return round(sqrt(pow(this.x, 2) + pow(this.y, 2)) * 100) / 100;
  }

  /**
   * Adds this vector with another vector
   *
   * @param val - The vector to be added
   * @returns A new `Vector2` object
   */

  add(vec: Vector2) {
    return new Vector2(this.x + vec.x, this.y + vec.y);
  }

  addMut(vec: Vector2) {
    this.x += vec.x;
    this.y += vec.y;
    return this;
  }

  /**
   * Subtracts another vector from this vector
   *
   * @param val - The vector to be subtracted
   * @returns A new `Vector2` object
   */

  sub(vec: Vector2) {
    return new Vector2(this.x - vec.x, this.y - vec.y);
  }

  subMut(vec: Vector2) {
    this.x -= vec.x;
    this.y -= vec.y;
    return this;
  }

  /**
   * Adds a scalar to the vector
   *
   * @param val - The scalar
   * @returns A new `Vector2D` object with transformation
   */

  scalarAdd(val: number) {
    return new Vector2(this.x + val, this.y + val);
  }

  scalarAddMut(val: number) {
    this.x += val;
    this.y += val;
    return this;
  }

  /**
   * Scales the vector by a given factor.
   * @param f - The scaling factor
   * @returns A new `Vector2` with scaled components.
   */

  scale(f: number) {
    return new Vector2(this.x * f, this.y * f);
  }

  scaleMut(f: number) {
    this.x *= f;
    this.y *= f;
    return this;
  }

  /**
   * Dot product of two vectors
   * @param vec - A `Vector2` or `Vector3` object
   * @returns The dot product
   */

  dot(vec: Vector2 | Vector3) {
    return round((this.x * vec.x + this.y * vec.y) * 1000) / 1000;
  }

  /**
   * Calculates the area of the parallelogram between two 2D vectors
   * @param vec - A `Vector2` object
   * @returns A scalar value
   */

  area(vec: Vector2) {
    return round((this.x * vec.y - this.y * vec.x) * 1000) / 1000;
  }

  /**
   * The unit vector
   * @returns A `Vector2` object with unit magnitude
   */

  normalize() {
    let length = this.length();
    return new Vector2(this.x / length, this.y / length);
  }

  normalizeMut() {
    let length = this.length();
    this.x /= length;
    this.y /= length;
    return this;
  }

  /**
   * The angle of the vector from the x-axis
   * @returns The angle in radians
   */

  slope() {
    return round(atan2(this.y, this.x) * 1000) / 1000;
  }

  /**
   * The angle between the vector and the another vector
   * @param vec The second vector
   * @returns The angle in radians
   */

  angleBetween(vec: Vector2) {
    return acos(
      round((this.dot(vec) / (this.length() * vec.length())) * 1000) / 1000
    );
  }

  /**
   * Gets the rotation matrix corresponding to the angle
   * @param angle The angle the vector is to be rotated, positive for counter-clockwise and negative otherwise
   * @returns A `Matrix2D` object
   */

  getRotationMatrix(angle: number) {
    return new Matrix2D([
      [cos(angle), -sin(angle)],
      [sin(angle), cos(angle)],
    ]);
  }

  /**
   * Rotate a vector by a specified angle
   * @param angle The angle the vector is to be rotated, positive for counter-clockwise and negative otherwise
   * @returns A new `Vector2` object
   */

  rotate(angle: number) {
    return this.getRotationMatrix(angle)
      .matMultiply(this.toMatrix())
      .toVector2();
  }

  rotateMut(angle: number) {
    let v = this.rotate(angle);
    this.x = v.x;
    this.y = v.x;
    return this;
  }

  /**
   * Converts the `Vector2` to a `Matrix2D` object
   * @returns A `Matrix2D` object
   */

  toMatrix() {
    return new Matrix2D([[this.x], [this.y]]);
  }

  /**
   * Converts the `Vector2` to a `Vector3` object
   * @returns A `Vector3` object
   */

  toVector3() {
    return new Vector3(this.x, this.y, 0);
  }

  /**
   * Project the vector on another vector
   * @param vec The base vector to be projected on
   * @returns A new `Vector2` object
   */

  projectOn(vec: Vector2) {
    return vec.scale(this.dot(vec) / vec.dot(vec));
  }

  /**
   * Linear interpolation of the vector
   * @param vec The vector to be interpolated with
   * @param p The parametric ratio to be interpolated on
   * @returns A new `Vector2` object
   */

  lerp(vec: Vector2, p: number) {
    const newX = this.x + (vec.x - this.x) * p;
    const newY = this.y + (vec.y - this.y) * p;
    return new Vector2(newX, newY);
  }
}

export class Vector3 {
  constructor(
    public x: number = 1,
    public y: number = 1,
    public z: number = 1
  ) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /**
   * Creates a deep copy of the vector
   * @returns A new `Vector3` object
   */

  clone() {
    return new Vector3(this.x, this.y, this.z);
  }

  /**
   * The magnitude of the vector
   * @returns A scalar value
   */

  length() {
    return sqrt(pow(this.x, 2) + pow(this.y, 2) + pow(this.z, 2));
  }

  /**
   * Adds this vector with another vector
   *
   * @param val - The vector to be added
   * @returns A new `Vector3` object
   */

  add(vec: Vector3) {
    return new Vector3(this.x + vec.x, this.y + vec.y, this.z + vec.z);
  }

  addMut(vec: Vector3) {
    (this.x += vec.x), (this.y += vec.y), (this.z += vec.z);
    return this;
  }

  /**
   * Subtracts another vector from this vector
   *
   * @param val - The vector to be subtracted
   * @returns A new `Vector3` object
   */

  sub(vec: Vector3) {
    return new Vector3(this.x - vec.x, this.y - vec.y, this.z - vec.z);
  }

  subMut(vec: Vector3) {
    (this.x -= vec.x), (this.y -= vec.y), (this.z -= vec.z);
    return this;
  }

  /**
   * Adds a scalar to the vector
   *
   * @param val - The scalar
   * @returns A new `Vector3` object with transformation
   */

  scalarAdd(val: number) {
    return new Vector3(this.x + val, this.y + val, this.z + val);
  }

  scalarAddMut(val: number) {
    (this.x += val), (this.y += val), (this.z += val);
    return this;
  }

  /**
   * Scales the vector by a given factor.
   * @param f - The scaling factor
   * @returns A new `Vector3` with scaled components.
   */

  scale(f: number) {
    return new Vector3(this.x * f, this.y * f, this.z * f);
  }

  scaleMut(f: number) {
    (this.x *= f), (this.y *= f), (this.z *= f);
    return this;
  }

  /**
   * Dot product of two vectors
   * @param vec - A `Vector2` or `Vector3` object
   * @returns The dot product
   */

  dot(vec: Vector3 | Vector2) {
    return round((this.x * vec.x + this.y * vec.y + this.z * 0) * 1000) / 1000;
  }

  /**
   * Cross product of two vectors
   * @param vec - A second vector
   * @returns A new `Vector3` object (cross product)
   */

  cross(vec: Vector3) {
    let x = this.y * vec.z - vec.y * this.z;
    let y = vec.x * this.z - this.x * vec.z;
    let z = this.x * vec.y - vec.x * this.y;
    return new Vector3(x, y, z);
  }

  /**
   * The unit vector
   * @returns A `Vector3` object with unit magnitude
   */

  normalize() {
    return new Vector3(
      this.x / this.length(),
      this.y / this.length(),
      this.z / this.length()
    );
  }

  normalizeMut() {
    (this.x /= this.length()),
      (this.y /= this.length()),
      (this.z /= this.length());
    return this;
  }

  /**
   * The angle between the vector and the another vector
   * @param vec The second vector
   * @returns The angle in radians
   */

  angleBetween(vec: Vector3) {
    return acos(
      round((this.dot(vec) / (this.length() * vec.length())) * 1000) / 1000
    );
  }

  /**
   * Gets an array of rotation matrices corresponding to the angle with respect to each axis
   * @param angle The angle the vector is to be rotated, positive for counter-clockwise and negative otherwise
   * @returns An array of `Matrix2D` objects
   */

  getRotationMatrices(angle: number) {
    return [
      new Matrix2D([
        [1, 0, 0],
        [0, cos(angle), -sin(angle)],
        [0, sin(angle), cos(angle)],
      ]),
      new Matrix2D([
        [cos(angle), 0, sin(angle)],
        [0, 1, 0],
        [-sin(angle), 1, cos(angle)],
      ]),
      new Matrix2D([
        [cos(angle), -sin(angle), 0],
        [sin(angle), cos(angle), 0],
        [0, 0, 1],
      ]),
    ];
  }

  /**
   * Rotate a vector by a specified angle about the x-axis
   * @param angle The angle the vector is to be rotated, positive for counter-clockwise and negative otherwise
   * @returns A new `Vector3` object
   */

  rotateX(angle: number) {
    return this.getRotationMatrices(angle)[0]
      .matMultiply(this.toMatrix())
      .toVector3();
  }

  rotateXMut(angle: number) {
    let v = this.rotateX(angle);
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  }

  /**
   * Rotate a vector by a specified angle about the y-axis
   * @param angle The angle the vector is to be rotated, positive for counter-clockwise and negative otherwise
   * @returns A new `Vector3` object
   */

  rotateY(angle: number) {
    return this.getRotationMatrices(angle)[1]
      .matMultiply(this.toMatrix())
      .toVector3();
  }

  rotateYMut(angle: number) {
    let v = this.rotateY(angle);
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  }

  /**
   * Rotate a vector by a specified angle about the z-axis
   * @param angle The angle the vector is to be rotated, positive for counter-clockwise and negative otherwise
   * @returns A new `Vector3` object
   */

  rotateZ(angle: number) {
    return this.getRotationMatrices(angle)[2]
      .matMultiply(this.toMatrix())
      .toVector3();
  }

  rotateZMut(angle: number) {
    let v = this.rotateZ(angle);
    this.x = v.x;
    this.y = v.y;
    this.z = v.z;
    return this;
  }

  /**
   * Converts the `Vector3` to a `Matrix2D` object
   * @returns A `Matrix2D` object
   */

  toMatrix() {
    return new Matrix2D([[this.x], [this.y], [this.z]]);
  }

  /**
   * Project the vector on another vector
   * @param vec The base vector to be projected on
   * @returns A new `Vector3` object
   */

  projectOn(vec: Vector3) {
    return vec.scale(this.dot(vec) / vec.dot(vec));
  }

  /**
   * Linear interpolation of the vector
   * @param vec The vector to be interpolated with
   * @param p The parametric ratio to be interpolated on
   * @returns A new `Vector3` object
   */

  lerp(vec: Vector3, p: number) {
    const newX = this.x + (vec.x - this.x) * p;
    const newY = this.y + (vec.y - this.y) * p;
    const newZ = this.z + (vec.z - this.z) * p;
    return new Vector3(newX, newY, newZ);
  }
}