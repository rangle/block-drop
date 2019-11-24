import { Dictionary, objReduce } from '@ch1/utility';
import {
  Matrix3_1,
  SceneGraph,
  ProgramContext,
  TextureDictionary,
  ImageDictionary,
  BufferMap,
  ProgramContextConfig,
  DrawContext,
  SceneConfig,
} from './interfaces';
import { createObjectPool } from './utility/object-pool';
import { create1 } from './engine/engine';
import { createLanguageState } from './languages';
import { createEventEmitter } from './utility/event';
import { createMatrix3_1 } from './matrix/matrix-3';
import { createMatrix4_4 } from './matrix/matrix-4';
import { createEmptySceneGraph, sceneConfigToNode } from './gl/scene-graph';
import {
  blockConfig,
  dataDict,
  sceneConfig,
  materialTexturePaths,
} from './configuration';
declare const LOG_LEVEL: string;
const WebGLDebugUtils: any =
  LOG_LEVEL === 'debug'
    ? require('../vendor/webgl-debug').WebGLDebugUtils
    : undefined;

function body() {
  const canvas = window.document.createElement('canvas');
  const languages = window.document.createElement('span');
  const editor = window.document.createElement('section');
  const uiToGameState = createEventEmitter();

  languages.className = 'languages';
  window.document.body.appendChild(canvas);

  import('./languages')
    .then(lang => {
      const ls = createLanguageState();
      ls.on(() => (window.document.title = ls.current().meta.title));
      lang.main(languages, ls);
      window.document.body.appendChild(languages);
      return import('./editor').then(ed => {
        ed.main(editor, ls, uiToGameState);
        window.document.body.appendChild(editor);
        ls.set();
      });
    })
    .catch((e: Error) => {
      throw e;
    });

  return { canvas, uiToGameState };
}

function getContext(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl');
  if (!gl) {
    throw new Error('unable to get GL context');
  }
  return gl;
}

export function createGlContext() {
  const tree = body();
  const gl =
    LOG_LEVEL === 'debug'
      ? WebGLDebugUtils.makeDebugContext(getContext(tree.canvas))
      : getContext(tree.canvas);

  // set the clear colour
  gl.clearColor(0, 0, 0, 0);

  // enable cull face
  gl.enable(gl.CULL_FACE);

  // enable depth test
  gl.enable(gl.DEPTH_TEST);

  return { gl, tree };
}

export function createDrawContext(
  programConfigs: Dictionary<ProgramContextConfig>,
  imageDict: ImageDictionary
): DrawContext {
  const { gl, tree } = createGlContext();

  const bufferMap: BufferMap = new Map();

  const op3_1 = createObjectPool(createMatrix3_1, 500);
  const op4_4 = createObjectPool(createMatrix4_4, 1000);
  const opScene = createObjectPool(
    () => createEmptySceneGraph(op3_1, op4_4),
    1000
  );

  const textureDict: TextureDictionary = {};

  const programDict = objReduce(
    programConfigs,
    (dict: Dictionary<ProgramContext>) => {
      // dict[key] = createProgramFromConfig(shaderDict, gl, config);
      return dict;
    },
    {}
  );

  const scenes: SceneGraph[] = sceneConfig.map(sceneConfig => {
    return sceneConfigToNode(
      opScene,
      dataDict,
      programDict,
      imageDict,
      textureDict,
      bufferMap,
      gl,
      sceneConfig
    );
  });

  if (scenes.length > 1) {
    throw new Error('only one scene allowed now');
  }
  if (scenes.length === 0) {
    throw new Error('no scene provided');
  }

  scenes[0].updateWorldMatrix();
  const sceneList = scenes[0].toArray();

  const engine = create1({
    debug: true,
    preview: 3,
    seed: 'hello-world',
  });

  function listener(engine: any, e: KeyboardEvent) {
    switch (e.keyCode) {
      case 37:
        engine.controls.moveLeft();
        break;
      case 38:
        engine.controls.moveUp();
        break;
      case 39:
        engine.controls.moveRight();
        break;
      case 40:
        engine.controls.moveDown();
        break;
      case 81:
        engine.controls.rotateLeft();
        break;
      case 87:
        engine.controls.rotateRight();
        break;
      default:
        break;
    }
  }

  window.addEventListener('keydown', e => listener(engine, e));

  const context = {
    bufferMap,
    cameraPosition: [0, 250, -500] as Matrix3_1,
    cameraTarget: [0.5, 0.5, 0.5] as Matrix3_1,
    cameraUp: [0, 1, 0] as Matrix3_1,
    canvas: tree.canvas,
    doRedraw: false,
    engine: engine,
    getBlockFromInt,
    gl,
    imageDict: imageDict,
    op3_1,
    op4_4,
    opScene,
    programDict,
    resize,
    scene: scenes[0],
    sceneList,
    textureDict,
  };

  tree.uiToGameState.on('cameras', (value: Matrix3_1) => {
    context.cameraPosition[0] = value[0];
    context.cameraPosition[1] = value[1];
    context.cameraPosition[2] = value[2];
  });

  engine.on('redraw', () => (context.doRedraw = true));

  return context;
}

export function loadImages(imageDict: ImageDictionary) {
  return Promise.all(
    objReduce(
      materialTexturePaths,
      (promises: Promise<void>[], texturePath) => {
        promises.push(
          new Promise((resolve, reject) => {
            const image = new Image();
            image.src = texturePath;
            image.addEventListener('load', () => {
              imageDict[texturePath] = image;
              resolve();
            });
            image.addEventListener('error', (e: any) => {
              reject(e);
            });
          })
        );
        return promises;
      },
      []
    )
  );
}

export function resize(canvas: HTMLCanvasElement) {
  // Lookup the size the browser is displaying the canvas.
  const displayWidth = canvas.clientWidth;
  const displayHeight = canvas.clientHeight;

  // Check if the canvas is not the same size.
  if (canvas.width != displayWidth || canvas.height != displayHeight) {
    // Make the canvas the same size
    canvas.width = displayWidth;
    canvas.height = displayHeight;
  }
}

export function getBlockFromInt(context: DrawContext, int: number) {
  let config: SceneConfig;
  switch (int) {
    case 10:
      config = blockConfig.green;
      break;
    case 19:
      config = blockConfig.greenDash;
      break;
    case 20:
      config = blockConfig.red;
      break;
    case 29:
      config = blockConfig.redDash;
      break;
    case 30:
      config = blockConfig.blue;
      break;
    case 39:
      config = blockConfig.blueDash;
      break;
    default:
      config = blockConfig.blue;
      break;
  }
  return sceneConfigToNode(
    context.opScene,
    dataDict,
    context.programDict,
    context.imageDict,
    context.textureDict,
    context.bufferMap,
    context.gl,
    config,
    context.op3_1,
    context.op4_4
  );
}
