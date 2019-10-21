import {
  SceneGraph,
  Shape,
  Matrix4_4,
  SceneGraphShape,
  ObjectPool,
  ProgramContext,
  SceneConfig,
  DataDictionary,
  BufferMap,
  ImageDictionary,
  TextureDictionary,
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
import { Dictionary } from '@ch1/utility';
import { shapeConfigToShape } from './shape';

export function createEmptySceneGraph(
  op3_1 = createObjectPool(createMatrix3_1),
  op4_4 = createObjectPool(createMatrix4_4)
): SceneGraph {
  const scene: SceneGraph = {
    children: [],
    localMatrix: op4_4.malloc(),
    name: 'empty node',
    op3_1,
    op4_4,
    parent: null,
    rotation: op3_1.malloc(),
    scale: op3_1.malloc(),
    translation: op3_1.malloc(),
    worldMatrix: op4_4.malloc(),

    setParent: (parentScene: null | SceneGraph) =>
      setParent(scene, parentScene),
    toArray: (): SceneGraphShape[] => sceneGraphToSceneArray(scene),
    updateLocalMatrix: () => {
      updateLocalMatrix(scene, op4_4);
    },
    updateWorldMatrix: (parentWorldMatrix?: Matrix4_4) => {
      updateWorldMatrix(scene, parentWorldMatrix, op4_4);
    },
    walk: (callback: (s: SceneGraph) => void) => {
      walkScene(scene, callback);
    },
  };
  return scene;
}

export function createSceneGraph(
  opScene: ObjectPool<SceneGraph>,
  name: string,
  shape?: Shape,
  op3_1 = createObjectPool(createMatrix3_1),
  op4_4 = createObjectPool(createMatrix4_4)
): SceneGraph {
  const scene = opScene.malloc();
  scene.rotation[0] = 0;
  scene.rotation[1] = 0;
  scene.rotation[2] = 0;
  scene.scale[0] = 1;
  scene.scale[1] = 1;
  scene.scale[2] = 1;
  scene.translation[0] = 0;
  scene.translation[1] = 0;
  scene.translation[2] = 0;

  scene.children = [];
  op4_4.free(scene.localMatrix);
  scene.localMatrix = identity4_4(op4_4);
  scene.name = name;
  scene.op3_1 = op3_1;
  scene.op4_4 = op4_4;
  scene.parent = null;
  scene.shape = shape;
  op4_4.free(scene.worldMatrix);
  scene.worldMatrix = identity4_4(op4_4);

  scene.setParent = (parentScene: null | SceneGraph) =>
    setParent(scene, parentScene);
  scene.toArray = (): SceneGraphShape[] => sceneGraphToSceneArray(scene);
  scene.updateLocalMatrix = () => {
    updateLocalMatrix(scene, op4_4);
  };
  scene.updateWorldMatrix = (parentWorldMatrix?: Matrix4_4) => {
    updateWorldMatrix(scene, parentWorldMatrix, op4_4);
  };
  scene.walk = (callback: (s: SceneGraph) => void) => {
    walkScene(scene, callback);
  };

  return scene;
}

export function setParent(child: SceneGraph, parent: null | SceneGraph) {
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

export function sceneConfigToNode(
  opScene: ObjectPool<SceneGraph>,
  dataDict: DataDictionary,
  programDict: Dictionary<ProgramContext>,
  imageDict: ImageDictionary,
  textureDict: TextureDictionary,
  bufferMap: BufferMap,
  gl: WebGLRenderingContext,
  sceneConfig: SceneConfig,
  op3_1 = createObjectPool(createMatrix3_1),
  op4_4 = createObjectPool(createMatrix4_4)
): SceneGraph {
  const shape = sceneConfig.shape
    ? shapeConfigToShape(
        dataDict,
        programDict,
        imageDict,
        textureDict,
        bufferMap,
        gl,
        sceneConfig.shape
      )
    : undefined;
  const node = createSceneGraph(opScene, sceneConfig.name, shape, op3_1, op4_4);
  node.localMatrix = op4_4.malloc();
  if (sceneConfig.initialTranslation) {
    node.translation[0] = sceneConfig.initialTranslation[0];
    node.translation[1] = sceneConfig.initialTranslation[1];
    node.translation[2] = sceneConfig.initialTranslation[2];
  } else {
    node.translation[0] = 0;
    node.translation[1] = 0;
    node.translation[2] = 0;
  }
  if (sceneConfig.initialRotation) {
    node.rotation[0] = sceneConfig.initialRotation[0];
    node.rotation[1] = sceneConfig.initialRotation[1];
    node.rotation[2] = sceneConfig.initialRotation[2];
  } else {
    node.rotation[0] = 0;
    node.rotation[1] = 0;
    node.rotation[2] = 0;
  }
  if (sceneConfig.initialScale) {
    node.scale[0] = sceneConfig.initialScale[0];
    node.scale[1] = sceneConfig.initialScale[1];
    node.scale[2] = sceneConfig.initialScale[2];
  } else {
    node.scale[0] = 1;
    node.scale[1] = 1;
    node.scale[2] = 1;
  }
  node.updateLocalMatrix();
  sceneConfig.children.forEach(childConfig => {
    const child = sceneConfigToNode(
      opScene,
      dataDict,
      programDict,
      imageDict,
      textureDict,
      bufferMap,
      gl,
      childConfig
    );
    child.setParent(node);
  });
  return node;
}
