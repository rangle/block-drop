import {
  SceneGraph,
  Shape,
  Matrix4_4,
  SceneGraphShape,
  ObjectPool,
} from '../interfaces';
import {
  identity4_4,
  copy4_4,
  multiply4_4,
  translate4_4,
  xRotate4_4,
  yRotate4_4,
  zRotate4_4,
  scale4_4,
  createMatrix4_4,
} from '../matrix/matrix-4';
import { createObjectPool } from '../object-pool';
import { createMatrix3_1 } from '../matrix/matrix-3';

export function createSceneGraph(
  name: string,
  shape?: Shape,
  op3_1 = createObjectPool(createMatrix3_1),
  op4_4 = createObjectPool(createMatrix4_4)
): SceneGraph {
  const rotation = op3_1.malloc();
  const scale = op3_1.malloc();
  const translation = op3_1.malloc();
  rotation[0] = 0;
  rotation[1] = 0;
  rotation[2] = 0;
  scale[0] = 1;
  scale[1] = 1;
  scale[2] = 1;
  translation[0] = 0;
  translation[1] = 0;
  translation[2] = 0;
  const node = {
    children: [],
    localMatrix: identity4_4(),
    name,
    op3_1,
    op4_4,
    parent: null,
    rotation,
    scale,
    shape,
    translation,
    worldMatrix: identity4_4(),
    setParent: (parent: null | SceneGraph) => setParent(node, parent),
    toArray: (): SceneGraphShape[] => sceneGraphToSceneArray(node),
    updateLocalMatrix: () => {
      updateLocalMatrix(node, op4_4);
    },
    updateWorldMatrix: (parentWorldMatrix?: Matrix4_4) => {
      updateWorldMatrix(node, parentWorldMatrix, op4_4);
    },
    walk: (callback: (s: SceneGraph) => void) => {
      walkScene(node, callback);
    },
  };
  return node;
}

export function setParent(child: SceneGraph, parent: null | SceneGraph = null) {
  // unlink the child
  if (child.parent) {
    const childIndex = child.parent.children.indexOf(child);
    if (childIndex >= 0) {
      child.parent.children.splice(childIndex, 1);
    }
  }
  if (parent) {
    parent.children.push(child);
  }
  child.parent = parent;
  return child;
}

export function updateWorldMatrix(
  node: SceneGraph,
  parentWorldMatrix?: Matrix4_4,
  op: ObjectPool<Matrix4_4> = createObjectPool(createMatrix4_4)
) {
  if (parentWorldMatrix) {
    const newWorldMatrix = multiply4_4(parentWorldMatrix, node.localMatrix, op);
    op.free(node.worldMatrix);
    node.worldMatrix = newWorldMatrix;
  } else {
    const newWorldMatrix = copy4_4(node.localMatrix, op);
    op.free(node.worldMatrix);
    node.worldMatrix = newWorldMatrix;
  }

  node.children.forEach(child => {
    updateWorldMatrix(child, node.worldMatrix, op);
  });
}

export function sceneGraphToSceneArray(
  scene: SceneGraph,
  arr: SceneGraphShape[] = []
): SceneGraphShape[] {
  if (scene.shape) {
    arr.push(scene as SceneGraphShape);
  }
  scene.children.forEach(child => {
    sceneGraphToSceneArray(child, arr);
  });

  return arr;
}

export function walkScene(
  scene: SceneGraph,
  callback: (scene: SceneGraph) => void
): void {
  callback(scene);
  scene.children.forEach(child => {
    walkScene(child, callback);
  });
}

export function updateLocalMatrix(
  scene: SceneGraph,
  op = createObjectPool(createMatrix4_4)
): void {
  const identity = identity4_4(op);
  const t1 = translate4_4(
    identity,
    scene.translation[0],
    scene.translation[1],
    scene.translation[2],
    op
  );
  const t2 = xRotate4_4(t1, scene.rotation[0], op);
  const t3 = yRotate4_4(t2, scene.rotation[1], op);
  const t4 = zRotate4_4(t3, scene.rotation[2], op);
  const t5 = scale4_4(t4, scene.scale[0], scene.scale[1], scene.scale[2], op);
  op.free(scene.localMatrix);
  op.free(identity);
  op.free(t1);
  op.free(t2);
  op.free(t3);
  op.free(t4);
  scene.localMatrix = t5;
}
