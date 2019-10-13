import {
  identity4_4,
  translate4_4,
  yRotate4_4,
  perspective4_4,
  inverse4_4,
  multiply4_4,
  lookAt4_4,
} from './matrix/matrix-4';
import { Matrix3_1, ShapeConfig, Shape } from './interfaces';
import { createProgramFromConfig } from './gl/program';
import {
  ProgramContextConfig,
  ProgramContext,
  ShaderDictionary,
} from './interfaces';
import { fColours, fPositions } from './gl/shape-generator';
import { shapeConfigToShape } from './gl/shape';
import { objEach } from '@ch1/utility';

const shaderDict: ShaderDictionary = {
  simple: {
    fragment: require('./shaders/simple-fragment.glsl'),
    vertex: require('./shaders/simple-vertex.glsl'),
  },
};

const dataDict = {
  fColours: fColours(),
  fPositions: fPositions(),
};

const fConfig: ShapeConfig = {
  coloursDataName: 'fColours',
  positionsDataName: 'fPositions',
  programName: 'simple',
};

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
  shapes: Shape[];
}

function main() {
  try {
    const context = setup([simpleConfig], [fConfig]);
    draw(context);

    setInterval(() => {
      if (context.cameraAngle >= Math.PI * 2) {
        context.cameraAngle = 0;
      } else {
        context.cameraAngle += Math.PI / 64;
      }
      draw(context);
    }, 15);
  } catch (err) {
    console.log(err);
    window.document.body.appendChild(error(err.message));
  }
}

function setup(
  programConfigs: ProgramContextConfig[],
  shapeConfigs: ShapeConfig[]
) {
  const tree = body();
  const gl = getContext(tree.canvas);

  const programs = programConfigs.map(config => {
    return createProgramFromConfig(shaderDict, gl, config);
  });

  const shapes = shapeConfigs.map(shapeConfig => {
    return shapeConfigToShape(dataDict, { simple: programs[0] }, shapeConfig);
  });

  const context = {
    cameraAngle: 0,
    canvas: tree.canvas,
    gl,
    programs,
    shapes,
  };
  // set the clear colour
  gl.clearColor(0, 0, 0, 0);

  // enable cull face
  gl.enable(gl.CULL_FACE);

  // enable depth test
  gl.enable(gl.DEPTH_TEST);

  return context;
}

function draw({ cameraAngle, canvas, gl, shapes }: DrawContext) {
  // resize/reset the viewport
  resize(gl.canvas as HTMLCanvasElement);

  // clip space to pixel space
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  const up: Matrix3_1 = [0, 1, 0];
  const identityMatrix = identity4_4();

  shapes.forEach(({ colours, context, positions }) => {
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

    let cameraMatrix = yRotate4_4(identityMatrix, cameraAngle);
    cameraMatrix = translate4_4(cameraMatrix, 0, 0, 300);

    const cameraPosition: Matrix3_1 = [
      cameraMatrix[12],
      cameraMatrix[13],
      cameraMatrix[14],
    ];

    cameraMatrix = lookAt4_4(cameraPosition, [200, 0, 0], up);

    let viewMatrix = inverse4_4(cameraMatrix);

    let projectionMatrix = perspective4_4(
      (90 * Math.PI) / 180,
      canvas.clientWidth / canvas.clientHeight,
      1,
      2000
    );

    let viewProjectionMatrix = multiply4_4(projectionMatrix, viewMatrix);

    const matrix = translate4_4(viewProjectionMatrix, 200, 0, 0);
    gl.uniformMatrix4fv(context.uniforms.u_matrix.location, false, matrix);

    // run the program
    const primitiveType = gl.TRIANGLES;
    const count = 16 * 6;

    gl.drawArrays(primitiveType, 0, count);
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
