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
} from './gl/shape-generator';
import { objEach } from '@ch1/utility';
import { sceneConfigToNode } from './gl/scene-graph';
import { normalize3_1, createMatrix3_1 } from './matrix/matrix-3';
import { simpleConfig } from './gl/programs/simple';
import { simpleDirectionalConfig } from './gl/programs/simple-directional';
import { createObjectPool } from './object-pool';

const shaderDict: ShaderDictionary = {
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
  cubeColours: cubeColours(),
  cubeNormals: cubeNormals(),
  cubePositions: cubePositions(),
};

const fLightConfig: ShapeConfig = {
  coloursDataName: 'fColours',
  lightDirection: [0.2, -0.9, -1],
  normalsDataName: 'fNormals',
  positionsDataName: 'fPositions',
  programName: 'simple-directional',
};

const fConfig: ShapeConfig = {
  coloursDataName: 'fColours',
  positionsDataName: 'fPositions',
  programName: 'simple',
};

const cubeLightConfig: ShapeConfig = {
  coloursDataName: 'cubeColours',
  positionsDataName: 'cubePositions',
  programName: 'simple-directional',
  normalsDataName: 'cubeNormals',
};

const cubeConfig: ShapeConfig = {
  coloursDataName: 'cubeColours',
  positionsDataName: 'cubePositions',
  programName: 'simple',
};

const sceneConfig: SceneConfig[] = [
  {
    children: [
      {
        children: [],
        name: 'sun',
        shape: fLightConfig,
      },
      {
        children: [
          {
            children: [],
            name: 'mercury',
            initialScale: [0.3, 0.3, 0.3],
            shape: cubeConfig,
          },
        ],
        initialTranslation: [300, 0, 0],
        name: 'mercury orbit',
      },
      {
        children: [
          {
            children: [],
            name: 'venus',
            initialScale: [0.5, 0.5, 0.5],
            shape: cubeConfig,
          },
        ],
        initialTranslation: [500, 0, 0],
        name: 'venus orbit',
      },
      {
        children: [
          {
            children: [],
            name: 'earth',
            initialScale: [0.6, 0.6, 0.6],
            shape: cubeLightConfig,
          },
          {
            children: [
              {
                children: [],
                name: 'moon',
                initialScale: [0.2, 0.2, 0.2],
                shape: fConfig,
              },
            ],
            initialTranslation: [75, 0, 0],
            name: 'moon orbit',
          },
        ],
        initialTranslation: [700, 0, 0],
        name: 'earth orbit',
      },
      {
        children: [
          {
            children: [],
            name: 'mars',
            initialScale: [0.35, 0.35, 0.35],
            shape: cubeConfig,
          },
          {
            children: [
              {
                children: [],
                name: 'phobos',
                initialScale: [0.15, 0.15, 0.15],
                shape: fConfig,
              },
            ],
            initialTranslation: [75, 0, 0],
            name: 'phobos orbit',
          },
          {
            children: [
              {
                children: [],
                name: 'deimos',
                initialScale: [0.15, 0.15, 0.15],
                shape: fConfig,
              },
            ],
            initialTranslation: [100, 0, 0],
            name: 'deimos orbit',
          },
        ],
        initialTranslation: [900, 0, 0],
        name: 'mars orbit',
      },
    ],
    name: 'solar orbit',
  },
];

main();

interface DrawContext {
  bufferMap: BufferMap;
  canvas: HTMLCanvasElement;
  cameraPosition: Matrix3_1;
  cameraTarget: Matrix3_1;
  cameraUp: Matrix3_1;
  gl: WebGLRenderingContext;
  lastProgram?: WebGLProgram;
  op3_1: ObjectPool<Matrix3_1>;
  op4_4: ObjectPool<Matrix4_4>;
  programs: ProgramContext[];
  scene: SceneGraph;
  sceneList: SceneGraphShape[];
}

function main() {
  try {
    const context = setup([simpleConfig, simpleDirectionalConfig]);
    draw(context);

    const go = () => {
      requestAnimationFrame(() => {
        context.scene.walk(s => {
          if (s.name.indexOf('orbit') >= 0) {
            s.rotation[1] += 0.01;
            s.updateLocalMatrix();
          }
          [
            'mercury',
            'venus',
            'earth',
            'moon',
            'mars',
            'phobos',
            'deimos',
          ].forEach(name => {
            if (s.name === name) {
              s.rotation[1] += 0.07;
              s.updateLocalMatrix();
            }
          });
        });
        context.scene.updateWorldMatrix();
        draw(context);
        go();
      });
    };
    go();
  } catch (err) {
    console.log(err);
    window.document.body.appendChild(error(err.message));
  }
}

function setup(programConfigs: ProgramContextConfig[]) {
  const tree = body();
  const gl = getContext(tree.canvas);
  const bufferMap: BufferMap = new Map();

  const op3_1 = createObjectPool(createMatrix3_1, 500);
  const op4_4 = createObjectPool(createMatrix4_4, 1000);

  const programs = programConfigs.map(config => {
    return createProgramFromConfig(shaderDict, gl, config);
  });

  const scenes: SceneGraph[] = sceneConfig.map(sceneConfig => {
    return sceneConfigToNode(
      dataDict,
      { simple: programs[0], 'simple-directional': programs[1] },
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

  const context = {
    bufferMap,
    cameraPosition: [0, 1200, -1200] as Matrix3_1,
    cameraTarget: [0.5, 0.5, 0.5] as Matrix3_1,
    cameraUp: [0, 1, 0] as Matrix3_1,
    canvas: tree.canvas,
    gl,
    op3_1,
    op4_4,
    programs,
    scene: scenes[0],
    sceneList,
  };
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
    let normalizedLight: Matrix3_1 | null = null;
    if (scene.shape.a_normal) {
      worldInverseMatrix = inverse4_4(matrix, op4_4);
      worldInverseTransposeMatrix = transpose4_4(worldInverseMatrix, op4_4);
      gl.uniformMatrix4fv(
        context.uniforms.u_worldInverseTranspose.location,
        false,
        worldInverseTransposeMatrix
      );

      normalizedLight = normalize3_1(scene.shape.lightDirection, op3_1);
      gl.uniform3fv(
        context.uniforms.u_reverseLightDirection.location,
        normalizedLight
      );
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
    if (normalizedLight) {
      op3_1.free(normalizedLight);
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
