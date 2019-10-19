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
} from './gl/shape-generator';
import { objEach, Dictionary, objReduce } from '@ch1/utility';
import { sceneConfigToNode, createEmptySceneGraph } from './gl/scene-graph';
import { normalize3_1, createMatrix3_1 } from './matrix/matrix-3';
import { simpleConfig } from './gl/programs/simple';
import { simpleDirectionalConfig } from './gl/programs/simple-directional';
import { advancedDirectionalConfig } from './gl/programs/advanced-directional';
import { createObjectPool } from './object-pool';
import { create1 } from './engine/engine';

const shaderDict: ShaderDictionary = {
  'advanced-directional': {
    fragment: require('./shaders/advanced-directional-fragment.glsl'),
    vertex: require('./shaders/advanced-directional-vertex.glsl'),
  },
  simple: {
    fragment: require('./shaders/simple-fragment.glsl'),
    vertex: require('./shaders/simple-vertex.glsl'),
  },
  'simple-directional': {
    fragment: require('./shaders/simple-directional-fragment.glsl'),
    vertex: require('./shaders/simple-directional-vertex.glsl'),
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
  coloursDataName: 'cubeBlue',
  lightDirectionalConfigs: [
    {
      direction: [0.3, 0.6, -1.0],
      ambient: [0.1, 0.1, 0.1],
      diffuse: [0.7, 0.7, 0.7],
      specular: [0.5, 0.5, 0.5],
    },
  ],
  positionsDataName: 'cubePositions',
  programName: 'advanced-directional',
  normalsDataName: 'cubeNormals',
};

const cubeGreenConfig: ShapeConfig = {
  coloursDataName: 'cubeGreen',
  lightDirectionalConfigs: [
    {
      direction: [10, 10, -10],
    },
  ],
  positionsDataName: 'cubePositions',
  programName: 'simple-directional',
  normalsDataName: 'cubeNormals',
};

const cubeRedConfig: ShapeConfig = {
  coloursDataName: 'cubeRed',
  lightDirectionalConfigs: [
    {
      direction: [10, 10, -10],
    },
  ],
  positionsDataName: 'cubePositions',
  programName: 'simple-directional',
  normalsDataName: 'cubeNormals',
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
};

const programConfigDict = {
  'advanced-directional': advancedDirectionalConfig,
  simple: simpleConfig,
  'simple-directional': simpleDirectionalConfig,
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
  op3_1: ObjectPool<Matrix3_1>;
  op4_4: ObjectPool<Matrix4_4>;
  opScene: ObjectPool<SceneGraph>;
  programDict: Dictionary<ProgramContext>;
  scene: SceneGraph;
  sceneList: SceneGraphShape[];
}

function main() {
  try {
    const context = setup(programConfigDict);
    draw(context);

    const go = () => {
      requestAnimationFrame(() => {
        if (context.doRedraw) {
          context.scene.rotation[1] += 0.1;
          context.scene.updateLocalMatrix();
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

          context.scene.updateWorldMatrix();
          draw(context);
        }
        go();
      });
    };
    go();
  } catch (err) {
    console.log(err);
    window.document.body.appendChild(error(err.message));
  }
}

function getBlockFromInt(context: DrawContext, int: number) {
  let config: SceneConfig;
  switch (int) {
    case 10:
      config = blockConfig.green;
      break;
    case 20:
      config = blockConfig.red;
      break;
    case 30:
      config = blockConfig.blue;
      break;
    default:
      config = blockConfig.blue;
      break;
  }
  return sceneConfigToNode(
    context.opScene,
    dataDict,
    context.programDict,
    context.bufferMap,
    context.gl,
    config,
    context.op3_1,
    context.op4_4
  );
}

function setup(programConfigs: Dictionary<ProgramContextConfig>): DrawContext {
  const tree = body();
  const gl = getContext(tree.canvas);
  const bufferMap: BufferMap = new Map();

  const op3_1 = createObjectPool(createMatrix3_1, 500);
  const op4_4 = createObjectPool(createMatrix4_4, 1000);
  const opScene = createObjectPool(
    () => createEmptySceneGraph(op3_1, op4_4),
    1000
  );

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
  };

  window.document.addEventListener('keypress', (e: KeyboardEvent) => {
    switch (e.keyCode) {
      case 106:
        context.cameraPosition[0] += 10;
        context.cameraPosition[2] -= 10;
        break;
      case 105:
        context.cameraPosition[1] += 10;
        break;
      case 108:
        context.cameraPosition[0] -= 10;
        context.cameraPosition[2] += 10;
        break;
      case 107:
        context.cameraPosition[1] -= 10;
        break;
      default:
        break;
    }
  });

  engine.on('redraw', () => (context.doRedraw = true));
  // set the clear colour
  gl.clearColor(0, 0, 0, 0);

  // enable cull face
  gl.enable(gl.CULL_FACE);

  // enable depth test
  gl.enable(gl.DEPTH_TEST);

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

      if (context.uniforms.u_world) {
        gl.uniformMatrix4fv(
          context.uniforms.u_world.location,
          false,
          scene.worldMatrix
        );
      }

      if (scene.shape.lightDirectional.length) {
        if (context.uniforms['u_dirLight.direction']) {
          let normalized = normalize3_1(
            scene.shape.lightDirectional[0].direction,
            op3_1
          );
          gl.uniform3fv(
            context.uniforms['u_dirLight.direction'].location,
            normalized
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

        if (context.uniforms.u_reverseLightDirection) {
          normalizedDirection = normalize3_1(
            scene.shape.lightDirectional[0].direction,
            op3_1
          );
          gl.uniform3fv(
            context.uniforms.u_reverseLightDirection.location,
            normalizedDirection
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

  window.document.body.appendChild(canvas);

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
