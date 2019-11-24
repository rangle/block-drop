import { Matrix4_4, ObjectPool } from '../interfaces';
import {
  identity4_4,
  createMatrix4_4,
  multiply4_4,
  copy4_4,
} from '../matrix/matrix-4';
import {
  ShapeLite,
  Lights,
  ShapePointLight,
  ShapeSpotLight,
} from './interfaces';
import { createObjectPool } from '../utility/object-pool';
import { Trs } from './trs';

export class Scene {
  static create(
    trs: Trs,
    lights?: Lights,
    shape?: ShapeLite,
    op4_4: ObjectPool<Matrix4_4> = createObjectPool(createMatrix4_4)
  ) {
    return new Scene(trs, lights, shape, op4_4);
  }
  private children: Scene[] = [];
  private parent: null | Scene = null;
  private worldMatrix: Matrix4_4 = identity4_4(this.op4_4);

  constructor(
    public trs: Trs,
    private lights?: Lights,
    private shape?: ShapeLite,
    private op4_4: ObjectPool<Matrix4_4> = createObjectPool(createMatrix4_4)
  ) {}

  addChild(child: Scene) {
    this.children.push(child);
  }

  removeChild(child: Scene) {
    const index = this.children.indexOf(child);
    if (index >= 0) {
      this.children.splice(index, 1);
    }
  }

  setParent(parent: null | Scene) {
    if (this.parent) {
      this.parent.removeChild(this);
    }

    if (parent) {
      parent.addChild(this);
    }

    this.parent = parent;
  }

  updateWorldMatrix(parentWorldMatrix: null | Matrix4_4) {
    this.op4_4.free(this.worldMatrix);
    const localMatrix = this.trs.getMatrix();
    if (parentWorldMatrix) {
      this.worldMatrix = multiply4_4(
        localMatrix,
        parentWorldMatrix,
        this.op4_4
      );
    } else {
      this.worldMatrix = copy4_4(localMatrix, this.op4_4);
    }

    if (this.shape) {
      this.shape.world = this.worldMatrix;
    }

    if (this.lights) {
      const updatePosition = (light: ShapePointLight | ShapeSpotLight) => {
        light.position[0] = this.worldMatrix[12];
        light.position[1] = this.worldMatrix[13];
        light.position[2] = this.worldMatrix[14];
      };
      this.lights.points.forEach(updatePosition);
      this.lights.spots.forEach(light => {
        updatePosition(light);
        /** @todo update direction */
      });
    }

    this.children.forEach(child => {
      child.updateWorldMatrix(this.worldMatrix);
    });
  }

  toShapeArray(container: ShapeLite[] = []) {
    if (this.shape) {
      container.push(this.shape);
    }
    this.children.forEach(child => child.toShapeArray(container));

    return container;
  }

  toLights(
    container: Lights = {
      directionals: [],
      points: [],
      spots: [],
    }
  ) {
    if (this.lights) {
      this.lights.directionals.forEach(light => {
        container.directionals.push(light);
      });
      this.lights.points.forEach(light => {
        container.points.push(light);
      });
      this.lights.spots.forEach(light => {
        container.spots.push(light);
      });
    }

    this.children.forEach(child => {
      child.toLights(container);
    });

    return container;
  }
}
