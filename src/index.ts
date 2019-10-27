import {
  perspective4_4,
  inverse4_4,
  multiply4_4,
  lookAt4_4,
  transpose4_4,
  createMatrix4_4,
} from './matrix/matrix-4';
import {
  Matrix3_1,
  ShapeConfig,
  SceneGraph,
  SceneGraphShape,
  SceneConfig,
  BufferMap,
  ObjectPool,
  Matrix4_4,
  ImageDictionary,
  TextureDictionary,
} from './interfaces';
import { createProgramFromConfig } from './gl/program';
import {
  ProgramContextConfig,
  ProgramContext,
  ShaderDictionary,
} from './interfaces';
import {
  fColours,
  fPositions,
  cubeColours,
  cubePositions,
  fNormals,
  cubeNormals,
  cubeBlack,
  cubeBlue,
  cubeGreen,
  cubeRed,
  cubeTextures,
  colouredCubeTextures,
} from './gl/shape-generator';
import { objEach, Dictionary, objReduce } from '@ch1/utility';
import { sceneConfigToNode, createEmptySceneGraph } from './gl/scene-graph';
import { normalize3_1, createMatrix3_1 } from './matrix/matrix-3';
import { simpleConfig } from './gl/programs/simple';
import { simpleDirectionalConfig } from './gl/programs/simple-directional';
import { advancedDirectionalConfig } from './gl/programs/advanced-directional';
import { advancedDirectionalSimpleTextureConfig } from './gl/programs/advanced-directional-simple-texture';
import { createObjectPool } from './object-pool';
import { create1 } from './engine/engine';
import { simpleTextureConfig } from './gl/programs/simple-texture';
import { simpleDirPointMixConfig } from './gl/programs/simple-dir_point_mix';
import { createLanguageState } from './languages';
declare const LOG_LEVEL: string;
const WebGLDebugUtils: any =
  LOG_LEVEL === 'debug'
    ? require('../vendor/webgl-debug').WebGLDebugUtils
    : undefined;
const blueTexturePath = require('../assets/blue-2048-2048.png');
const greenTexturePath = require('../assets/green-2048-2048.png');
// const redTexturePath = require('../assets/red-2048-2048.png');
const blueDashTexturePath = require('../assets/dash-blue-2048-2048.png');
const greenDashTexturePath = require('../assets/dash-green-2048-2048.png');
const redDashTexturePath = require('../assets/dash-red-2048-2048.png');

const shaderDict: ShaderDictionary = {
  'advanced-directional-simple-texture': {
    fragment: require('./shaders/advanced-directional-simple-texture-fragment.glsl'),
    vertex: require('./shaders/advanced-directional-simple-texture-vertex.glsl'),
  },
  'advanced-directional': {
    fragment: require('./shaders/advanced-directional-fragment.glsl'),
    vertex: require('./shaders/advanced-directional-vertex.glsl'),
  },
  simple: {
    fragment: require('./shaders/simple-fragment.glsl'),
    vertex: require('./shaders/simple-vertex.glsl'),
  },
  'simple-dir_point_mix': {
    fragment: require('./shaders/simple-dir_point_mix-fragment.glsl'),
    vertex: require('./shaders/simple-dir_point_mix-vertex.glsl'),
  },
  'simple-directional': {
    fragment: require('./shaders/simple-directional-fragment.glsl'),
    vertex: require('./shaders/simple-directional-vertex.glsl'),
  },
  'simple-texture': {
    fragment: require('./shaders/simple-texture-fragment.glsl'),
    vertex: require('./shaders/simple-texture-vertex.glsl'),
  },
};

const dataDict = {
  fColours: fColours(),
  fNormals: fNormals(),
  fPositions: fPositions(),
  cubeBlack: cubeBlack(),
  cubeBlue: cubeBlue(),
  cubeColours: cubeColours(),
  cubeGreen: cubeGreen(),
  cubeNormals: cubeNormals(),
  cubePositions: cubePositions(),
  cubeRed: cubeRed(),
  cubeTextures: cubeTextures(),
  colouredCubeTextures: colouredCubeTextures(),
};

const cubeBlackConfig: ShapeConfig = {
  coloursDataName: 'cubeBlack',
  lightDirectionalConfigs: [
    {
      direction: [10, 10, -10],
    },
  ],
  positionsDataName: 'cubePositions',
  programName: 'simple-directional',
  normalsDataName: 'cubeNormals',
};

const cubeBlueConfig: ShapeConfig = {
  lightDirectionalConfigs: [
    {
      direction: [0.3, 0.6, -1.0],
      ambient: [0.1, 0.1, 0.1],
      diffuse: [0.7, 0.7, 0.7],
      specular: [0.5, 0.5, 0.5],
    },
  ],
  positionsDataName: 'cubePositions',
  programName: 'advanced-directional-simple-texture',
  normalsDataName: 'cubeNormals',
  texturesDataName: 'colouredCubeTextures',
  texturePath: blueTexturePath,
};

const cubeGreenConfig: ShapeConfig = {
  // coloursDataName: 'cubeGreen',
  // lightDirectionalConfigs: [
  //   {
  //     direction: [10, 10, -10],
  //   },
  // ],
  positionsDataName: 'cubePositions',
  programName: 'simple-texture',
  // normalsDataName: 'cubeNormals',
  texturesDataName: 'colouredCubeTextures',
  texturePath: greenTexturePath,
};

const cubeRedConfig: ShapeConfig = {
  coloursDataName: 'cubeRed',
  lightDirectionalConfigs: [
    {
      direction: [0.3, 0.6, -1.0],
      ambient: [0.1, 0.1, 0.1],
      diffuse: [0.7, 0.7, 0.7],
      specular: [0.5, 0.5, 0.5],
    },
  ],
  positionsDataName: 'cubePositions',
  programName: 'simple-dir_point_mix',
  normalsDataName: 'cubeNormals',
  // texturesDataName: 'colouredCubeTextures',
  // texturePath: redTexturePath,
};

const cubeBlueDashConfig: ShapeConfig = {
  coloursDataName: 'cubeBlue',
  lightDirectionalConfigs: [
    {
      direction: [0.3, 0.6, -1.0],
      ambient: [0.1, 0.1, 0.1],
      diffuse: [0.9, 0.9, 0.9],
      specular: [0.5, 0.5, 0.5],
    },
  ],
  positionsDataName: 'cubePositions',
  programName: 'advanced-directional-simple-texture',
  normalsDataName: 'cubeNormals',
  texturesDataName: 'colouredCubeTextures',
  texturePath: blueDashTexturePath,
};

const cubeGreenDashConfig: ShapeConfig = {
  // coloursDataName: 'cubeGreen',
  // lightDirectionalConfigs: [
  //   {
  //     direction: [10, 10, -10],
  //   },
  // ],
  positionsDataName: 'cubePositions',
  programName: 'simple-texture',
  // normalsDataName: 'cubeNormals',
  texturesDataName: 'colouredCubeTextures',
  texturePath: greenDashTexturePath,
};

const cubeRedDashConfig: ShapeConfig = {
  // coloursDataName: 'cubeRed',
  // lightDirectionalConfigs: [
  //   {
  //     direction: [10, 10, -10],
  //   },
  // ],
  positionsDataName: 'cubePositions',
  programName: 'simple-texture',
  // normalsDataName: 'cubeNormals',
  texturesDataName: 'colouredCubeTextures',
  texturePath: redDashTexturePath,
};

const sceneConfig: SceneConfig[] = [
  {
    children: [
      {
        children: [],
        name: 'the block',
        initialScale: [5000, 1, 5000],
        initialTranslation: [0, -1, 0],
        shape: cubeBlackConfig,
      },
    ],
    name: 'the void',
  },
];

export const blockConfig: Dictionary<SceneConfig> = {
  blue: {
    children: [],
    name: 'blue block',
    initialScale: [25, 25, 25],
    shape: cubeBlueConfig,
  },
  green: {
    children: [],
    name: 'green block',
    initialScale: [25, 25, 25],
    shape: cubeGreenConfig,
  },
  red: {
    children: [],
    name: 'red block',
    initialScale: [25, 25, 25],
    shape: cubeRedConfig,
  },
  blueDash: {
    children: [],
    name: 'blue block',
    initialScale: [25, 25, 25],
    shape: cubeBlueDashConfig,
  },
  greenDash: {
    children: [],
    name: 'green block',
    initialScale: [25, 25, 25],
    shape: cubeGreenDashConfig,
  },
  redDash: {
    children: [],
    name: 'red block',
    initialScale: [25, 25, 25],
    shape: cubeRedDashConfig,
  },
};

const programConfigDict = {
  'advanced-directional-simple-texture': advancedDirectionalSimpleTextureConfig,
  'advanced-directional': advancedDirectionalConfig,
  simple: simpleConfig,
  'simple-dir_point_mix': simpleDirPointMixConfig,
  'simple-directional': simpleDirectionalConfig,
  'simple-texture': simpleTextureConfig,
};

main();

interface DrawContext {
  bufferMap: BufferMap;
  canvas: HTMLCanvasElement;
  cameraPosition: Matrix3_1;
  cameraTarget: Matrix3_1;
  cameraUp: Matrix3_1;
  doRedraw: boolean;
  engine: any;
  gl: WebGLRenderingContext;
  lastProgram?: WebGLProgram;
  lastTexture?: WebGLTexture;
  op3_1: ObjectPool<Matrix3_1>;
  op4_4: ObjectPool<Matrix4_4>;
  opScene: ObjectPool<SceneGraph>;
  programDict: Dictionary<ProgramContext>;
  scene: SceneGraph;
  sceneList: SceneGraphShape[];
  textureDict: TextureDictionary;
  imageDict: ImageDictionary;
}

function main() {
  try {
    const imageDict: ImageDictionary = {};
    load(imageDict)
      .then(() => {
        const context = setup(programConfigDict, imageDict);
        start(context);
      })
      .catch((e: Error) => {
        throw e;
      });
  } catch (err) {
    console.log(err);
    window.document.body.appendChild(error(err.message));
  }
}

function start(context: DrawContext) {
  draw(context);
  let then = 0;
  const rotationSpeed = 1.2;

  const go = () => {
    requestAnimationFrame((now: number) => {
      const nowSeconds = now * 0.001;
      const deltaTime = nowSeconds - then;
      then = nowSeconds;
      if (context.doRedraw) {
        const newChildren: SceneGraph[] = [];
        for (let i = 0; i < context.engine.buffer.length; i += 1) {
          const el = context.engine.buffer[i];
          if (el !== 0) {
            const block = getBlockFromInt(context, el);
            const j =
              context.engine.config.width * context.engine.config.height - i;
            const y = 25 * Math.floor(j / context.engine.config.width) + 25;
            const x = 25 * (j % context.engine.config.width);
            block.translation[0] = x;
            block.translation[1] = y;
            newChildren.push(block);
          }
        }
        context.scene.children.forEach((child, i) => {
          if (i === 0) {
            return;
          }
          context.opScene.free(child);
        });
        context.scene.children.splice(1);
        newChildren.forEach(child => {
          child.updateLocalMatrix();
          child.setParent(context.scene);
        });
        context.sceneList = context.scene.toArray();
        context.doRedraw = false;
      }
      context.scene.rotation[1] += rotationSpeed * deltaTime;
      context.scene.updateLocalMatrix();
      context.scene.updateWorldMatrix();
      draw(context);
      go();
    });
  };
  go();
}

function getBlockFromInt(context: DrawContext, int: number) {
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

function load(imageDict: ImageDictionary) {
  return Promise.all(
    objReduce(
      blockConfig,
      (promises: Promise<void>[], config) => {
        if (config.shape && config.shape.texturePath) {
          const texturePath = config.shape.texturePath;
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
        }
        return promises;
      },
      []
    )
  );
}

function setup(
  programConfigs: Dictionary<ProgramContextConfig>,
  imageDict: ImageDictionary
): DrawContext {
  const tree = body();
  const gl =
    LOG_LEVEL === 'debug'
      ? WebGLDebugUtils.makeDebugContext(getContext(tree.canvas))
      : getContext(tree.canvas);

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
    (dict: Dictionary<ProgramContext>, config, key) => {
      dict[key] = createProgramFromConfig(shaderDict, gl, config);
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
    gl,
    op3_1,
    op4_4,
    opScene,
    programDict,
    scene: scenes[0],
    sceneList,
    textureDict,
    imageDict: imageDict,
  };

  engine.on('redraw', () => (context.doRedraw = true));
  // set the clear colour
  gl.clearColor(0, 0, 0, 0);

  // enable cull face
  gl.enable(gl.CULL_FACE);

  // enable depth test
  gl.enable(gl.DEPTH_TEST);

  // gl.enable(gl.BLEND);
  // gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  return context;
}

function draw(drawContext: DrawContext) {
  const {
    cameraPosition,
    cameraTarget,
    cameraUp,
    canvas,
    gl,
    op3_1,
    op4_4,
    sceneList,
  } = drawContext;
  // resize/reset the viewport
  resize(gl.canvas as HTMLCanvasElement);

  // clip space to pixel space
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const projectionMatrix = perspective4_4(
    (90 * Math.PI) / 180,
    canvas.clientWidth / canvas.clientHeight,
    1,
    5000,
    op4_4
  );

  const cameraMatrix = lookAt4_4(
    cameraPosition,
    cameraTarget,
    cameraUp,
    op4_4,
    op3_1
  );

  const viewMatrix = inverse4_4(cameraMatrix, op4_4);
  const viewProjectionMatrix = multiply4_4(projectionMatrix, viewMatrix, op4_4);

  sceneList.forEach(scene => {
    const { context, vertexCount } = scene.shape;
    // check/cache this
    if (drawContext.lastProgram !== context.program) {
      gl.useProgram(context.program);
      drawContext.lastProgram = context.program;
    }

    objEach(context.attributes, (attribute, name) => {
      const { location, normalize, offset, size, stride, type } = attribute;
      gl.enableVertexAttribArray(location);
      gl.bindBuffer(gl.ARRAY_BUFFER, (scene.shape as any)[name as string]);
      gl.vertexAttribPointer(location, size, type, normalize, stride, offset);
    });

    const matrix = multiply4_4(viewProjectionMatrix, scene.worldMatrix, op4_4);
    gl.uniformMatrix4fv(context.uniforms.u_matrix.location, false, matrix);

    let worldInverseMatrix: Matrix4_4 | null = null;
    let worldInverseTransposeMatrix: Matrix4_4 | null = null;
    let normalizedDirection: Matrix3_1 | null = null;

    if (scene.shape.a_texcoord) {
      if (scene.shape.texture) {
        if (drawContext.lastTexture != scene.shape.texture) {
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, scene.shape.texture);
          drawContext.lastTexture = scene.shape.texture;
        }
      }
      gl.uniform1i(context.uniforms.u_texture.location, 0);
    }

    if (scene.shape.a_normal) {
      worldInverseMatrix = inverse4_4(scene.worldMatrix, op4_4);
      worldInverseTransposeMatrix = transpose4_4(worldInverseMatrix, op4_4);
      gl.uniformMatrix4fv(
        context.uniforms.u_worldInverseTranspose.location,
        false,
        worldInverseTransposeMatrix
      );

      if (context.uniforms.u_viewWorldPosition) {
        gl.uniform3fv(
          context.uniforms.u_viewWorldPosition.location,
          cameraPosition
        );
      }

      if (context.uniforms.u_lightWorldPosition) {
        gl.uniform3fv(
          context.uniforms.u_lightWorldPosition.location,
          normalize3_1([-1, 1, -1], op3_1)
        );
      }

      if (context.uniforms.u_world) {
        gl.uniformMatrix4fv(
          context.uniforms.u_world.location,
          false,
          scene.worldMatrix
        );
      }

      if (scene.shape.lightDirectional.length) {
        if (context.uniforms['u_dirLight.direction']) {
          let normalizedDirection = normalize3_1(
            scene.shape.lightDirectional[0].direction,
            op3_1
          );
          gl.uniform3fv(
            context.uniforms['u_dirLight.direction'].location,
            normalizedDirection
          );
        }

        if (context.uniforms['u_dirLight.ambient']) {
          gl.uniform3fv(
            context.uniforms['u_dirLight.ambient'].location,
            scene.shape.lightDirectional[0].ambient
          );
        }

        if (context.uniforms['u_dirLight.diffuse']) {
          gl.uniform3fv(
            context.uniforms['u_dirLight.diffuse'].location,
            scene.shape.lightDirectional[0].diffuse
          );
        }

        if (context.uniforms['u_dirLight.specular']) {
          gl.uniform3fv(
            context.uniforms['u_dirLight.specular'].location,
            scene.shape.lightDirectional[0].specular
          );
        }
      }
    }

    // run the program
    const primitiveType = gl.TRIANGLES;

    gl.drawArrays(primitiveType, 0, vertexCount);

    // free scene memory
    op4_4.free(matrix);
    if (worldInverseMatrix) {
      op4_4.free(worldInverseMatrix);
    }
    if (worldInverseTransposeMatrix) {
      op4_4.free(worldInverseTransposeMatrix);
    }
    if (normalizedDirection) {
      op3_1.free(normalizedDirection);
    }
  });
  // free memory
  op4_4.free(projectionMatrix);
  op4_4.free(cameraMatrix);
  op4_4.free(viewMatrix);
  op4_4.free(viewProjectionMatrix);
}

function body() {
  const canvas = window.document.createElement('canvas');
  const languages = window.document.createElement('span');
  const editor = window.document.createElement('section');

  languages.className = 'languages';
  window.document.body.appendChild(canvas);

  import('./languages')
    .then(lang => {
      const ls = createLanguageState();
      ls.on(() => (window.document.title = ls.current().meta.title));
      lang.main(languages, ls);
      window.document.body.appendChild(languages);
      return import('./editor').then(ed => {
        ed.main(editor, ls);
        window.document.body.appendChild(editor);
        ls.set();
      });
    })
    .catch((e: Error) => {
      throw e;
    });

  return { canvas };
}

function getContext(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext('webgl');
  if (!gl) {
    throw new Error('unable to get GL context');
  }
  return gl;
}

function error(message: string) {
  const err = window.document.createElement('div');
  err.innerHTML = message;

  return err;
}

function resize(canvas: HTMLCanvasElement) {
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

// Returns a random integer from 0 to range - 1.
// function randomInt(range: number) {
//   return Math.floor(Math.random() * range);
// }
