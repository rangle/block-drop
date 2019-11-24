import { Matrix3_1, ObjectPool, Matrix4_4 } from '../interfaces';
import { createObjectPool } from '../utility/object-pool';
import { createMatrix3_1 } from '../matrix/matrix-3';
import { createMatrix4_4 } from '../matrix/matrix-4';
import { Trs } from './trs';

export class Camera {
  static create(
    op3_1: ObjectPool<Matrix3_1> = createObjectPool(createMatrix3_1),
    op4_4: ObjectPool<Matrix4_4> = createObjectPool(createMatrix4_4),
    position: Matrix3_1 = [1, 30, 200],
    rotation: Matrix3_1 = [0, 0, 0],
    upDirection: Matrix3_1 = [0, 1, 0]
  ) {
    return new Camera(op3_1, op4_4, position, rotation, upDirection);
  }

  constructor(
    op3_1: ObjectPool<Matrix3_1> = createObjectPool(createMatrix3_1),
    op4_4: ObjectPool<Matrix4_4> = createObjectPool(createMatrix4_4),
    position: Matrix3_1 = [1, 300, -200],
    rotation: Matrix3_1 = [0, 0, 0],
    private upDirection: Matrix3_1 = [0, 1, 0],
    public trs = Trs.create(position, rotation, undefined, op3_1, op4_4)
  ) {
    this.trs.getMatrix();
  }

  get() {
    return this.trs.getMatrix();
  }

  getPosition() {
    return this.trs.getTranslation();
  }

  lookAt(target: Matrix3_1) {
    this.trs.lookAt(target, this.upDirection);
  }
}
