import {
  perspective4_4,
  inverse4_4,
  multiply4_4,
  lookAt4_4,
  createYRotation4_4,
  translate4_4,
  xRotate4_4,
  yRotate4_4,
  zRotate4_4,
  scale4_4,
} from './matrix/matrix-4';
import {
  Matrix3_1,
  ShapeConfig,
  SceneGraph,
  SceneGraphShape,
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
} from './gl/shape-generator';
import { shapeConfigToShape } from './gl/shape';
import { objEach, Dictionary } from '@ch1/utility';
import {
  createSceneGraph,
  setParent,
  sceneGraphToSceneArray,
  updateWorldMatrix,
  walkScene,
} from './gl/scene-graph';

const shaderDict: ShaderDictionary = {
  simple: {
    fragment: require('./shaders/simple-fragment.glsl'),
    vertex: require('./shaders/simple-vertex.glsl'),
  },
};

const dataDict = {
  fColours: fColours(),
  fPositions: fPositions(),
  cubeColours: cubeColours(),
  cubePositions: cubePositions(),
};

const fConfig: ShapeConfig = {
  coloursDataName: 'fColours',
  positionsDataName: 'fPositions',
  programName: 'simple',
};

const cubeConfig: ShapeConfig = {
  coloursDataName: 'cubeColours',
  positionsDataName: 'cubePositions',
  programName: 'simple',
};

interface SceneConfig {
  children: SceneConfig[];
  initialRotation?: Matrix3_1;
  initialScale?: Matrix3_1;
  initialTranslation?: Matrix3_1;
  name: string;
  shape?: ShapeConfig;
}

const sceneConfig: SceneConfig[] = [
  {
    children: [
      {
        children: [],
        name: 'sun',
        shape: fConfig,
      },
      {
        children: [
          {
            children: [],
            name: 'mercury',
            shape: cubeConfig,
          },
        ],
        initialTranslation: [300, 0, 0],
        initialScale: [0.3, 0.3, 0.3],
        name: 'mercury orbit',
      },
      {
        children: [
          {
            children: [],
            name: 'venus',
            shape: cubeConfig,
          },
        ],
        initialTranslation: [500, 0, 0],
        initialScale: [0.5, 0.5, 0.5],
        name: 'venus orbit',
      },
      {
        children: [
          {
            children: [],
            name: 'earth',
            shape: cubeConfig,
          },
          {
            children: [
              {
                children: [],
                name: 'moon',
                shape: fConfig,
              },
            ],
            initialTranslation: [150, 0, 0],
            initialScale: [0.2, 0.2, 0.2],
            name: 'moon orbit',
          },
        ],
        initialTranslation: [700, 0, 0],
        initialScale: [0.6, 0.6, 0.6],
        name: 'earth orbit',
      },
      {
        children: [
          {
            children: [],
            name: 'mars',
            shape: cubeConfig,
          },
          {
            children: [
              {
                children: [],
                name: 'phobos',
                shape: fConfig,
              },
            ],
            initialTranslation: [150, 0, 0],
            initialScale: [0.15, 0.15, 0.15],
            name: 'phobos orbit',
          },
          {
            children: [
              {
                children: [],
                name: 'deimos',
                shape: fConfig,
              },
            ],
            initialTranslation: [200, 0, 0],
            initialScale: [0.15, 0.15, 0.15],
            name: 'deimos orbit',
          },
        ],
        initialTranslation: [900, 0, 0],
        initialScale: [0.35, 0.35, 0.35],
        name: 'mars orbit',
      },
    ],
    name: 'solar system',
  },
];

const simpleConfig: ProgramContextConfig = {
  attributes: [
    {
      name: 'a_colour',
      size: 3,
      type: 'UNSIGNED_BYTE',
      normalize: true,
      stride: 0,
      offset: 0,
    },
    {
      name: 'a_position',
      size: 3,
      type: 'FLOAT',
      normalize: false,
      stride: 0,
      offset: 0,
    },
  ],
  shaderNames: {
    fragment: 'simple',
    vertex: 'simple',
  },
  uniforms: [
    {
      name: 'u_matrix',
    },
  ],
};

main();

interface DrawContext {
  canvas: HTMLCanvasElement;
  cameraAngle: number;
  gl: WebGLRenderingContext;
  programs: ProgramContext[];
  scene: SceneGraph;
  sceneList: SceneGraphShape[];
}

function main() {
  try {
    const context = setup([simpleConfig]);
    draw(context);
    const rot = createYRotation4_4(0.01);

    const go = () => {
      requestAnimationFrame(() => {
        walkScene(context.scene, s => {
          if (s.name.indexOf('orbit') >= 0) {
            s.localMatrix = multiply4_4(rot, s.localMatrix);
          }
        });
        updateWorldMatrix(context.scene);
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

function sceneConfigToNode(
  programDict: Dictionary<ProgramContext>,
  sceneConfig: SceneConfig
): SceneGraph {
  const shape = sceneConfig.shape
    ? shapeConfigToShape(dataDict, programDict, sceneConfig.shape)
    : undefined;
  const node = createSceneGraph(sceneConfig.name, shape);
  if (sceneConfig.initialTranslation) {
    const t = sceneConfig.initialTranslation;
    node.localMatrix = translate4_4(node.localMatrix, t[0], t[1], t[2]);
  }
  if (sceneConfig.initialRotation) {
    const r = sceneConfig.initialRotation;
    node.localMatrix = xRotate4_4(node.localMatrix, r[0]);
    node.localMatrix = yRotate4_4(node.localMatrix, r[1]);
    node.localMatrix = zRotate4_4(node.localMatrix, r[2]);
  }
  if (sceneConfig.initialScale) {
    const s = sceneConfig.initialScale;
    node.localMatrix = scale4_4(node.localMatrix, s[0], s[1], s[2]);
  }
  sceneConfig.children.forEach(childConfig => {
    const child = sceneConfigToNode(programDict, childConfig);
    setParent(child, node);
  });
  return node;
}

function setup(programConfigs: ProgramContextConfig[]) {
  const tree = body();
  const gl = getContext(tree.canvas);

  const programs = programConfigs.map(config => {
    return createProgramFromConfig(shaderDict, gl, config);
  });

  const scenes: SceneGraph[] = sceneConfig.map(sceneConfig => {
    return sceneConfigToNode({ simple: programs[0] }, sceneConfig);
  });

  if (scenes.length > 1) {
    throw new Error('only one scene allowed now');
  }
  if (scenes.length === 0) {
    throw new Error('no scene provided');
  }

  updateWorldMatrix(scenes[0]);
  const sceneList = sceneGraphToSceneArray(scenes[0]);

  const context = {
    cameraAngle: 0,
    canvas: tree.canvas,
    gl,
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

function draw({ canvas, gl, sceneList }: DrawContext) {
  // resize/reset the viewport
  resize(gl.canvas as HTMLCanvasElement);

  // clip space to pixel space
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const cameraPosition: Matrix3_1 = [0, 1200, -1200];
  const target: Matrix3_1 = [0.5, 0.5, 0.5];
  const up: Matrix3_1 = [0, 1, 0];

  const projectionMatrix = perspective4_4(
    (90 * Math.PI) / 180,
    canvas.clientWidth / canvas.clientHeight,
    1,
    5000
  );
  const cameraMatrix = lookAt4_4(cameraPosition, target, up);

  const viewMatrix = inverse4_4(cameraMatrix);
  const viewProjectionMatrix = multiply4_4(projectionMatrix, viewMatrix);

  sceneList.forEach(scene => {
    const { colours, context, positions, vertexCount } = scene.shape;
    // check/cache this
    gl.useProgram(context.program);

    // setup positions (check cache)
    // check/cache buffer data
    gl.bindBuffer(gl.ARRAY_BUFFER, context.attributes.a_position.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    // setup colours (check cache)
    // check/cache buffer data
    gl.bindBuffer(gl.ARRAY_BUFFER, context.attributes.a_colour.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, colours, gl.STATIC_DRAW);

    objEach(context.attributes, attribute => {
      const { location, normalize, offset, size, stride, type } = attribute;
      gl.enableVertexAttribArray(location);
      gl.bindBuffer(gl.ARRAY_BUFFER, attribute.buffer);
      gl.vertexAttribPointer(location, size, type, normalize, stride, offset);
    });

    const matrix = multiply4_4(viewProjectionMatrix, scene.worldMatrix);
    gl.uniformMatrix4fv(context.uniforms.u_matrix.location, false, matrix);

    // run the program
    const primitiveType = gl.TRIANGLES;

    gl.drawArrays(primitiveType, 0, vertexCount);
  });
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
// Fills the buffer with the values that define a rectangle.

// function setRectangle(gl: WebGLRenderingContext, x: number, y: number, width: number, height: number) {
//   const x1 = x;
//   const x2 = x + width;
//   const y1 = y;
//   const y2 = y + height;

//   // NOTE: gl.bufferData(gl.ARRAY_BUFFER, ...) will affect
//   // whatever buffer is bound to the `ARRAY_BUFFER` bind point
//   // but so far we only have one buffer. If we had more than one
//   // buffer we'd want to bind that buffer to `ARRAY_BUFFER` first.

//   gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
//      x1, y1,
//      x2, y1,
//      x1, y2,
//      x1, y2,
//      x2, y1,
//      x2, y2]), gl.STATIC_DRAW);
// }

// Returns a random integer from 0 to range - 1.
// function randomInt(range: number) {
//   return Math.floor(Math.random() * range);
// }
