import { Matrix3_1, ObjectPool, Matrix4_4 } from '../interfaces';
import { createObjectPool } from '../utility/object-pool';
import { createMatrix3_1, subtract3_1, normalize3_1 } from '../matrix/matrix-3';
import {
  createMatrix4_4,
  identity4_4,
  lookAt4_4,
  translate4_4,
  xRotate4_4,
  zRotate4_4,
  yRotate4_4,
} from '../matrix/matrix-4';

const ninety = Math.PI / 2;

export class Camera {
  static create(
    op3_1: ObjectPool<Matrix3_1> = createObjectPool(createMatrix3_1),
    op4_4: ObjectPool<Matrix4_4> = createObjectPool(createMatrix4_4),
    position: Matrix3_1 = [1, 30, 200],
    rotation: Matrix3_1 = [0, 0, 0],
    target: Matrix3_1 = [0, 1, 0],
    upDirection: Matrix3_1 = [0, 1, 0]
  ) {
    return new Camera(op3_1, op4_4, position, rotation, target, upDirection);
  }

  private cameraMatrix: Matrix4_4;
  private isDirty = false;

  constructor(
    private op3_1: ObjectPool<Matrix3_1> = createObjectPool(createMatrix3_1),
    private op4_4: ObjectPool<Matrix4_4> = createObjectPool(createMatrix4_4),
    private position: Matrix3_1 = [1, 300, -200],
    private rotation: Matrix3_1 = [0, 0, 0],
    private target: Matrix3_1 = [0, 1, 0],
    private upDirection: Matrix3_1 = [0, 1, 0]
  ) {
    this.cameraMatrix = this.computeMatrix();
  }

  private computeMatrix() {
    const identity = identity4_4();
    const translated = translate4_4(
      identity,
      this.position[0],
      this.position[1],
      this.position[2]
    );
    const rotatedX = xRotate4_4(translated, this.rotation[0], this.op4_4);
    const rotatedY = yRotate4_4(rotatedX, this.rotation[1], this.op4_4);
    const rotatedZ = zRotate4_4(rotatedY, this.rotation[2], this.op4_4);

    this.op4_4.free(this.cameraMatrix);
    this.cameraMatrix = rotatedZ;

    this.op4_4.free(identity);
    this.op4_4.free(translated);
    this.op4_4.free(rotatedX);
    this.op4_4.free(rotatedY);

    return this.cameraMatrix;
  }

  forward(value: number) {
    this.position[0] -= value * Math.sin(this.rotation[1]);
    this.position[2] -= value * Math.cos(this.rotation[1]);
    this.isDirty = true;
  }

  backward(value: number) {
    this.position[0] += value * Math.sin(this.rotation[1]);
    this.position[2] += value * Math.cos(this.rotation[1]);
    this.isDirty = true;
  }

  strafeLeft(value: number) {
    this.position[0] += value * Math.sin(this.rotation[1] - ninety);
    this.position[2] += value * Math.cos(this.rotation[1] - ninety);
    this.isDirty = true;
  }

  strafeRight(value: number) {
    this.position[0] += value * Math.sin(this.rotation[1] + ninety);
    this.position[2] += value * Math.cos(this.rotation[1] + ninety);
    this.isDirty = true;
  }

  up(value: number) {
    this.position[1] += value;
    this.isDirty = true;
  }

  down(value: number) {
    this.position[1] -= value;
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

  get() {
    if (this.isDirty) {
      this.isDirty = false;
      this.computeMatrix();
    }
    return this.cameraMatrix;
  }

  getPosition() {
    return this.position;
  }

  lookAt(target: Matrix3_1) {
    this.target[0] = target[0];
    this.target[1] = target[1];
    this.target[2] = target[2];

    const t1 = subtract3_1(this.position, target, this.op3_1);
    const forwardNormal = normalize3_1(t1, this.op3_1);
    this.op3_1.free(t1);
    this.rotation[0] = Math.acos(forwardNormal[0]);
    this.rotation[1] = Math.acos(forwardNormal[1]);
    this.rotation[2] = Math.acos(forwardNormal[2]);
    this.op3_1.free(forwardNormal);

    this.cameraMatrix = lookAt4_4(
      this.position,
      this.target,
      this.upDirection,
      this.op4_4,
      this.op3_1
    );

    this.isDirty = false;
    return this.cameraMatrix;
  }
}
