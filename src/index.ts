import { ImageDictionary } from './interfaces';
import {
  loadImages,
  createDrawContext,
  createGlContext,
  resize,
} from './initialization';
import { programConfigDict } from './configuration';
import { drawLoop } from './render';
import {
  GlBindTypes,
  GlTypes,
  GlFragmentFunctionSnippets,
  GlVertexFunctionSnippets,
  GlProgram,
} from './gl/interfaces';
import { generateProgramGenerators } from './gl/program-generator';
import { generateAndCreateProgram } from './gl/program-compiler';
import { fPositions, fColours } from './gl/shape-generator';
import {
  perspective4_4,
  lookAt4_4,
  inverse4_4,
  multiply4_4,
  identity4_4,
} from './matrix/matrix-4';

const programConfig = {
  fragmentDeclarations: [
    {
      bindType: GlBindTypes.Varying,
      name: 'v_colour',
      varType: GlTypes.Vec4,
    },
  ],
  fragmentFunctions: [
    {
      declarations: [],
      name: 'main',
      returnType: GlTypes.Void,
      snippet: GlFragmentFunctionSnippets.Main1,
    },
  ],
  vertexDeclarations: [
    {
      bindType: GlBindTypes.Attribute,
      glType: 'FLOAT',
      name: 'a_position',
      varType: GlTypes.Vec4,
      normalize: false,
      offset: 0,
      size: 3,
      stride: 0,
    },
    {
      bindType: GlBindTypes.Attribute,
      glType: 'UNSIGNED_BYTE',
      name: 'a_colour',
      varType: GlTypes.Vec4,
      normalize: true,
      offset: 0,
      size: 3,
      stride: 0,
    },
    {
      bindType: GlBindTypes.Uniform,
      name: 'u_worldViewProjection',
      varType: GlTypes.Mat4,
    },
    {
      bindType: GlBindTypes.Varying,
      name: 'v_colour',
      varType: GlTypes.Vec4,
    },
  ],
  vertexFunctions: [
    {
      declarations: [],
      name: 'main',
      returnType: GlTypes.Void,
      snippet: GlVertexFunctionSnippets.Main1,
    },
  ],
};

main2();

function main2() {
  const { gl } = createGlContext();
  const glsl = generateProgramGenerators(programConfig);
  const program = generateAndCreateProgram(gl, programConfig, glsl);
  const fPosition = gl.createBuffer();
  if (!fPosition) {
    throw new Error('unable to allocate gl buffer');
  }
  const fPos = fPositions();
  const vertexCount = fPos.length / 3;
  gl.bindBuffer(gl.ARRAY_BUFFER, fPosition);
  gl.bufferData(gl.ARRAY_BUFFER, fPos, gl.STATIC_DRAW);
  const fColour = gl.createBuffer();
  if (!fColour) {
    throw new Error('unable to allocate gl buffer');
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, fColour);
  gl.bufferData(gl.ARRAY_BUFFER, fColours(), gl.STATIC_DRAW);

  render2({
    gl,
    program,
    fColour,
    fPosition,
    vertexCount,
  });
}

function render2(stuff: {
  gl: WebGLRenderingContext;
  program: GlProgram;
  fColour: WebGLBuffer;
  fPosition: WebGLBuffer;
  vertexCount: number;
}) {
  const { gl, program, fPosition, fColour, vertexCount } = stuff;
  const canvas = gl.canvas as HTMLCanvasElement;

  resize(gl.canvas as HTMLCanvasElement);

  // clip space to pixel space
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  gl.useProgram(program.program);

  const projectionMatrix = perspective4_4(
    (90 * Math.PI) / 180,
    canvas.clientWidth / canvas.clientHeight,
    1,
    5000
  );

  const cameraMatrix = lookAt4_4([1, 1, -500], [0, 0, 0], [0, 1, 0]);

  const viewMatrix = inverse4_4(cameraMatrix);
  const viewProjectionMatrix = multiply4_4(projectionMatrix, viewMatrix);
  const worldViewProjection = multiply4_4(viewProjectionMatrix, identity4_4());

  program.attributes.a_position(fPosition);
  program.attributes.a_colour(fColour);
  program.uniforms.u_worldViewProjection(worldViewProjection);

  const primitiveType = gl.TRIANGLES;

  gl.drawArrays(primitiveType, 0, vertexCount);
  requestAnimationFrame(() => render2(stuff));
}

// main();

export function main() {
  try {
    const imageDict: ImageDictionary = {};
    loadImages(imageDict)
      .then(() => {
        const context = createDrawContext(programConfigDict, imageDict);
        drawLoop(context);
      })
      .catch((e: Error) => {
        throw e;
      });
  } catch (err) {
    console.log(err);
    window.document.body.appendChild(error(err.message));
  }
}

function error(message: string) {
  const err = window.document.createElement('div');
  err.innerHTML = message;

  return err;
}

// Returns a random integer from 0 to range - 1.
// function randomInt(range: number) {
//   return Math.floor(Math.random() * range);
// }
