import { SceneGraph, Shape, Matrix4_4, SceneGraphShape } from '../interfaces';
import { identity4_4, copy4_4, multiply4_4 } from '../matrix/matrix-4';

export function createSceneGraph(name: string, shape?: Shape): SceneGraph {
  return {
    children: [],
    localMatrix: identity4_4(),
    name,
    parent: null,
    shape,
    worldMatrix: identity4_4(),
  };
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
  parentWorldMatrix?: Matrix4_4
) {
  if (parentWorldMatrix) {
    node.worldMatrix = multiply4_4(
      parentWorldMatrix,
      node.localMatrix,
      node.worldMatrix
    );
  } else {
    node.worldMatrix = copy4_4(node.localMatrix, node.worldMatrix);
  }

  node.children.forEach(child => {
    updateWorldMatrix(child, node.worldMatrix);
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
