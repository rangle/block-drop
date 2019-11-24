import { Matrix3_1, ObjectPool, Matrix4_4 } from '../interfaces';
import { createObjectPool } from '../utility/object-pool';
import {
  createMatrix4_4,
  identity4_4,
  translate4_4,
  xRotate4_4,
  yRotate4_4,
  zRotate4_4,
  scale4_4,
  lookAt4_4,
} from '../matrix/matrix-4';
import { subtract3_1, createMatrix3_1, normalize3_1 } from '../matrix/matrix-3';

const ninety = Math.PI / 2;

export class Trs {
  static create(
    translation: Matrix3_1 = [0, 0, 0],
    rotation: Matrix3_1 = [0, 0, 0],
    scale: Matrix3_1 = [1, 1, 1],
    op3_1: ObjectPool<Matrix3_1> = createObjectPool(createMatrix3_1),
    op4_4: ObjectPool<Matrix4_4> = createObjectPool(createMatrix4_4)
  ) {
    return new Trs(translation, rotation, scale, op3_1, op4_4);
  }

  private matrix: Matrix4_4 = identity4_4(this.op4_4);
  private isDirty = false;

  constructor(
    private translation: Matrix3_1 = [0, 0, 0],
    private rotation: Matrix3_1 = [0, 0, 0],
    private scale: Matrix3_1 = [1, 1, 1],
    private op3_1: ObjectPool<Matrix3_1> = createObjectPool(createMatrix3_1),
    private op4_4: ObjectPool<Matrix4_4> = createObjectPool(createMatrix4_4)
  ) {}

  setX(x: number) {
    this.translation[0] = x;
    this.isDirty = true;
  }
  setY(y: number) {
    this.translation[1] = y;
    this.isDirty = true;
  }
  setZ(z: number) {
    this.translation[2] = z;
    this.isDirty = true;
  }

  setRotationX(radians: number) {
    this.rotation[0] = radians;
    this.isDirty = true;
  }
  setRotationY(radians: number) {
    this.rotation[1] = radians;
    this.isDirty = true;
  }
  setRotationZ(radians: number) {
    this.rotation[2] = radians;
    this.isDirty = true;
  }

  setScaleX(xMultiplier: number) {
    this.scale[0] = xMultiplier;
    this.isDirty = true;
  }
  setScaleY(yMultiplier: number) {
    this.scale[1] = yMultiplier;
    this.isDirty = true;
  }
  setScaleZ(zMultiplier: number) {
    this.scale[2] = zMultiplier;
    this.isDirty = true;
  }

  rotateX(incrementRadians: number) {
    this.rotation[0] += incrementRadians;
    this.isDirty = true;
  }

  rotateY(incrementRadians: number) {
    this.rotation[1] += incrementRadians;
    this.isDirty = true;
  }

  rotateZ(incrementRadians: number) {
    this.rotation[2] += incrementRadians;
    this.isDirty = true;
  }

  scaleX(multiplier: number) {
    this.scale[0] *= multiplier;
    this.isDirty = true;
  }

  scaleY(multiplier: number) {
    this.scale[1] *= multiplier;
    this.isDirty = true;
  }

  scaleZ(multiplier: number) {
    this.scale[2] *= multiplier;
    this.isDirty = true;
  }

  translateX(increment: number) {
    this.translation[0] += increment;
    this.isDirty = true;
  }

  translateY(increment: number) {
    this.translation[1] += increment;
    this.isDirty = true;
  }

  translateZ(increment: number) {
    this.translation[2] += increment;
    this.isDirty = true;
  }

  forward(value: number) {
    this.translation[0] -= value * Math.sin(this.rotation[1]);
    this.translation[2] -= value * Math.cos(this.rotation[1]);
    this.isDirty = true;
  }

  backward(value: number) {
    this.translation[0] += value * Math.sin(this.rotation[1]);
    this.translation[2] += value * Math.cos(this.rotation[1]);
    this.isDirty = true;
  }

  strafeLeft(value: number) {
    this.translation[0] += value * Math.sin(this.rotation[1] - ninety);
    this.translation[2] += value * Math.cos(this.rotation[1] - ninety);
    this.isDirty = true;
  }

  strafeRight(value: number) {
    this.translation[0] += value * Math.sin(this.rotation[1] + ninety);
    this.translation[2] += value * Math.cos(this.rotation[1] + ninety);
    this.isDirty = true;
  }

  up(value: number) {
    this.translation[1] += value;
    this.isDirty = true;
  }

  down(value: number) {
    this.translation[1] -= value;
    this.isDirty = true;
  }

  rotateRight(value: number) {
    this.rotation[1] -= value;
    this.isDirty = true;
  }

  rotateLeft(value: number) {
    this.rotation[1] += value;
    this.isDirty = true;
  }

  getTranslation() {
    return this.translation;
  }

  getRotation() {
    return this.rotation;
  }

  getScale() {
    return this.scale;
  }

  getMatrix() {
    if (this.isDirty) {
      const id = identity4_4(this.op4_4);
      const t = translate4_4(
        id,
        this.translation[0],
        this.translation[1],
        this.translation[2],
        this.op4_4
      );
      const rx = xRotate4_4(t, this.rotation[0], this.op4_4);
      const ry = yRotate4_4(rx, this.rotation[1], this.op4_4);
      const rz = zRotate4_4(ry, this.rotation[2], this.op4_4);
      const scaled = scale4_4(
        rz,
        this.scale[0],
        this.scale[1],
        this.scale[2],
        this.op4_4
      );

      this.op4_4.free(id);
      this.op4_4.free(t);
      this.op4_4.free(rx);
      this.op4_4.free(ry);
      this.op4_4.free(rz);

      this.op4_4.free(this.matrix);
      this.matrix = scaled;
      this.isDirty = false;
    }

    return this.matrix;
  }

  lookAt(target: Matrix3_1, upDirection: Matrix3_1) {
    const t1 = subtract3_1(this.translation, target, this.op3_1);
    const forwardNormal = normalize3_1(t1, this.op3_1);
    this.op3_1.free(t1);
    this.rotation[0] = Math.acos(forwardNormal[0]);
    this.rotation[1] = Math.acos(forwardNormal[1]);
    this.rotation[2] = Math.acos(forwardNormal[2]);
    this.op3_1.free(forwardNormal);

    this.op4_4.free(this.matrix);
    this.matrix = lookAt4_4(
      this.translation,
      target,
      upDirection,
      this.op4_4,
      this.op3_1
    );

    this.isDirty = false;
    return this.matrix;
  }
}
