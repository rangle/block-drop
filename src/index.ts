import {
  identity4_4,
  translate4_4,
  yRotate4_4,
  perspective4_4,
  inverse4_4,
  multiply4_4,
  xRotate4_4,
  vectorMultiply,
  lookAt4_4,
} from './matrix-4';
import { Matrix3_1 } from './interfaces';

const fragment = require('./fragment.glsl');
const vertex = require('./vertex.glsl');

main();

interface DrawContext {
  attributes: {
    colour: number;
    position: number;
  };
  buffers: {
    colour: WebGLBuffer;
    position: WebGLBuffer;
  };
  cameraAngle: number;
  canvas: HTMLCanvasElement;
  fragmentShader: WebGLShader;
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  uniforms: {
    matrix: WebGLUniformLocation;
  };
  vertexShader: WebGLShader;
}

function main() {
  try {
    const context = setup();
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

// interface ProgramContextConfig {
//   attributes: {
//     name: string,
//   }[],
//   shaderPaths: {
//     fragment: string
//     vertex: string;
//   };
//   uniforms: {
//     name: string,
//   }[]
// }

// interface ProgramContext {

// }

function setup() {
  const tree = body();
  const gl = getContext(tree.canvas);
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragment);
  const program = createProgram(gl, vertexShader, fragmentShader);
  const positionAttributeLocation = gl.getAttribLocation(program, 'a_position');
  const colourAttributeLocation = gl.getAttribLocation(program, 'a_colour');

  const matrixUniformLocation = gl.getUniformLocation(program, 'u_matrix');

  const positionBuffer = gl.createBuffer();
  const colourBuffer = gl.createBuffer();

  if (!positionBuffer) {
    throw new Error('unable to create position buffer');
  }

  if (!colourBuffer) {
    throw new Error('unable to create colour buffer');
  }

  if (!matrixUniformLocation) {
    throw new Error('unable to find matrix location');
  }

  const context = {
    attributes: {
      colour: colourAttributeLocation,
      position: positionAttributeLocation,
    },
    buffers: {
      colour: colourBuffer,
      position: positionBuffer,
    },
    cameraAngle: 0,
    canvas: tree.canvas,
    gl,
    fragmentShader,
    program,
    uniforms: {
      matrix: matrixUniformLocation,
    },
    vertexShader,
  };
  // set the clear colour
  gl.clearColor(0, 0, 0, 0);

  // set the colours
  gl.bindBuffer(gl.ARRAY_BUFFER, colourBuffer);
  setColours(gl);

  // set the geometry
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  setGeometry(gl);

  // enable cull face
  gl.enable(gl.CULL_FACE);

  // enable depth test
  gl.enable(gl.DEPTH_TEST);

  return context;
}

function draw({
  attributes,
  buffers,
  cameraAngle,
  canvas,
  gl,
  program,
  uniforms,
}: DrawContext) {
  // resize/reset the viewport
  resize(gl.canvas as HTMLCanvasElement);

  // clip space to pixel space
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);

  const positionAttrib = () => {
    // enable the position attribute
    gl.enableVertexAttribArray(attributes.position);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    const size = 3; // 3 components per iteration
    const type = gl.FLOAT; // the data is 32bit floats
    const normalize = false; // don't normalize the data
    const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next position
    const offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(
      attributes.position,
      size,
      type,
      normalize,
      stride,
      offset
    );
  };

  const colourAttrib = () => {
    // enable the colour attribute
    gl.enableVertexAttribArray(attributes.colour);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffers.colour);

    // Tell the attribute how to get data out of colourBuffer (ARRAY_BUFFER)
    const size = 3; // 3 components per iteration
    const type = gl.UNSIGNED_BYTE; // the data is 32bit floats
    const normalize = true; // don't normalize the data
    const stride = 0; // 0 = move forward size * sizeof(type) each iteration to get the next colour
    const offset = 0; // start at the beginning of the buffer
    gl.vertexAttribPointer(
      attributes.colour,
      size,
      type,
      normalize,
      stride,
      offset
    );
  };

  positionAttrib();
  colourAttrib();

  const identityMatrix = identity4_4();

  const numFs = 5;
  const radius = 200;
  const fPosition: Matrix3_1 = [radius, 0, 0];

  let cameraMatrix = yRotate4_4(identityMatrix, cameraAngle);
  cameraMatrix = translate4_4(cameraMatrix, 0, 0, radius * 1.5);

  const cameraPosition: Matrix3_1 = [
    cameraMatrix[12],
    cameraMatrix[13],
    cameraMatrix[14],
  ];

  const up: Matrix3_1 = [0, 1, 0];
  cameraMatrix = lookAt4_4(cameraPosition, fPosition, up);

  let viewMatrix = inverse4_4(cameraMatrix);

  let projectionMatrix = perspective4_4(
    (90 * Math.PI) / 180,
    canvas.clientWidth / canvas.clientHeight,
    1,
    2000
  );

  let viewProjectionMatrix = multiply4_4(projectionMatrix, viewMatrix);

  for (let i = 0; i < numFs; i += 1) {
    const angle = (i * Math.PI * 2) / numFs;
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    const matrix = translate4_4(viewProjectionMatrix, x, 0, y);
    gl.uniformMatrix4fv(uniforms.matrix, false, matrix);

    // run the program
    const primitiveType = gl.TRIANGLES;
    const count = 16 * 6;

    gl.drawArrays(primitiveType, 0, count);
  }
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

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) {
    throw new Error('could not create shader: ' + source);
  }
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  const log = gl.getShaderInfoLog(shader);
  gl.deleteShader(shader);
  throw new Error('shader error: ' + log);
}

function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
) {
  const program = gl.createProgram();
  if (!program) {
    throw new Error('could not create GL program');
  }
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  const log = gl.getProgramInfoLog(program);

  gl.deleteProgram(program);

  throw new Error('could not compile GL: ' + log);
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

function setGeometry(gl: WebGLRenderingContext) {
  const positions = new Float32Array([
    // left column front
    0,
    0,
    0,
    0,
    150,
    0,
    30,
    0,
    0,
    0,
    150,
    0,
    30,
    150,
    0,
    30,
    0,
    0,

    // top rung front
    30,
    0,
    0,
    30,
    30,
    0,
    100,
    0,
    0,
    30,
    30,
    0,
    100,
    30,
    0,
    100,
    0,
    0,

    // middle rung front
    30,
    60,
    0,
    30,
    90,
    0,
    67,
    60,
    0,
    30,
    90,
    0,
    67,
    90,
    0,
    67,
    60,
    0,

    // left column back
    0,
    0,
    30,
    30,
    0,
    30,
    0,
    150,
    30,
    0,
    150,
    30,
    30,
    0,
    30,
    30,
    150,
    30,

    // top rung back
    30,
    0,
    30,
    100,
    0,
    30,
    30,
    30,
    30,
    30,
    30,
    30,
    100,
    0,
    30,
    100,
    30,
    30,

    // middle rung back
    30,
    60,
    30,
    67,
    60,
    30,
    30,
    90,
    30,
    30,
    90,
    30,
    67,
    60,
    30,
    67,
    90,
    30,

    // top
    0,
    0,
    0,
    100,
    0,
    0,
    100,
    0,
    30,
    0,
    0,
    0,
    100,
    0,
    30,
    0,
    0,
    30,

    // top rung right
    100,
    0,
    0,
    100,
    30,
    0,
    100,
    30,
    30,
    100,
    0,
    0,
    100,
    30,
    30,
    100,
    0,
    30,

    // under top rung
    30,
    30,
    0,
    30,
    30,
    30,
    100,
    30,
    30,
    30,
    30,
    0,
    100,
    30,
    30,
    100,
    30,
    0,

    // between top rung and middle
    30,
    30,
    0,
    30,
    60,
    30,
    30,
    30,
    30,
    30,
    30,
    0,
    30,
    60,
    0,
    30,
    60,
    30,

    // top of middle rung
    30,
    60,
    0,
    67,
    60,
    30,
    30,
    60,
    30,
    30,
    60,
    0,
    67,
    60,
    0,
    67,
    60,
    30,

    // right of middle rung
    67,
    60,
    0,
    67,
    90,
    30,
    67,
    60,
    30,
    67,
    60,
    0,
    67,
    90,
    0,
    67,
    90,
    30,

    // bottom of middle rung.
    30,
    90,
    0,
    30,
    90,
    30,
    67,
    90,
    30,
    30,
    90,
    0,
    67,
    90,
    30,
    67,
    90,
    0,

    // right of bottom
    30,
    90,
    0,
    30,
    150,
    30,
    30,
    90,
    30,
    30,
    90,
    0,
    30,
    150,
    0,
    30,
    150,
    30,

    // bottom
    0,
    150,
    0,
    0,
    150,
    30,
    30,
    150,
    30,
    0,
    150,
    0,
    30,
    150,
    30,
    30,
    150,
    0,

    // left side
    0,
    0,
    0,
    0,
    0,
    30,
    0,
    150,
    30,
    0,
    0,
    0,
    0,
    150,
    30,
    0,
    150,
    0,
  ]);

  let matrix = xRotate4_4(identity4_4(), Math.PI);
  matrix = translate4_4(matrix, -50, -75, -15);

  for (var i = 0; i < positions.length; i += 3) {
    var vector = vectorMultiply(
      [positions[i + 0], positions[i + 1], positions[i + 2], 1],
      matrix
    );
    positions[i + 0] = vector[0];
    positions[i + 1] = vector[1];
    positions[i + 2] = vector[2];
  }

  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);
}

function setColours(gl: WebGLRenderingContext) {
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Uint8Array([
      // left column front
      200,
      70,
      120,
      200,
      70,
      120,
      200,
      70,
      120,
      200,
      70,
      120,
      200,
      70,
      120,
      200,
      70,
      120,

      // top rung front
      200,
      70,
      120,
      200,
      70,
      120,
      200,
      70,
      120,
      200,
      70,
      120,
      200,
      70,
      120,
      200,
      70,
      120,

      // middle rung front
      200,
      70,
      120,
      200,
      70,
      120,
      200,
      70,
      120,
      200,
      70,
      120,
      200,
      70,
      120,
      200,
      70,
      120,

      // left column back
      80,
      70,
      200,
      80,
      70,
      200,
      80,
      70,
      200,
      80,
      70,
      200,
      80,
      70,
      200,
      80,
      70,
      200,

      // top rung back
      80,
      70,
      200,
      80,
      70,
      200,
      80,
      70,
      200,
      80,
      70,
      200,
      80,
      70,
      200,
      80,
      70,
      200,

      // middle rung back
      80,
      70,
      200,
      80,
      70,
      200,
      80,
      70,
      200,
      80,
      70,
      200,
      80,
      70,
      200,
      80,
      70,
      200,

      // top
      70,
      200,
      210,
      70,
      200,
      210,
      70,
      200,
      210,
      70,
      200,
      210,
      70,
      200,
      210,
      70,
      200,
      210,

      // top rung right
      200,
      200,
      70,
      200,
      200,
      70,
      200,
      200,
      70,
      200,
      200,
      70,
      200,
      200,
      70,
      200,
      200,
      70,

      // under top rung
      210,
      100,
      70,
      210,
      100,
      70,
      210,
      100,
      70,
      210,
      100,
      70,
      210,
      100,
      70,
      210,
      100,
      70,

      // between top rung and middle
      210,
      160,
      70,
      210,
      160,
      70,
      210,
      160,
      70,
      210,
      160,
      70,
      210,
      160,
      70,
      210,
      160,
      70,

      // top of middle rung
      70,
      180,
      210,
      70,
      180,
      210,
      70,
      180,
      210,
      70,
      180,
      210,
      70,
      180,
      210,
      70,
      180,
      210,

      // right of middle rung
      100,
      70,
      210,
      100,
      70,
      210,
      100,
      70,
      210,
      100,
      70,
      210,
      100,
      70,
      210,
      100,
      70,
      210,

      // bottom of middle rung.
      76,
      210,
      100,
      76,
      210,
      100,
      76,
      210,
      100,
      76,
      210,
      100,
      76,
      210,
      100,
      76,
      210,
      100,

      // right of bottom
      140,
      210,
      80,
      140,
      210,
      80,
      140,
      210,
      80,
      140,
      210,
      80,
      140,
      210,
      80,
      140,
      210,
      80,

      // bottom
      90,
      130,
      110,
      90,
      130,
      110,
      90,
      130,
      110,
      90,
      130,
      110,
      90,
      130,
      110,
      90,
      130,
      110,

      // left side
      160,
      160,
      220,
      160,
      160,
      220,
      160,
      160,
      220,
      160,
      160,
      220,
      160,
      160,
      220,
      160,
      160,
      220,
    ]),
    gl.STATIC_DRAW
  );
}
