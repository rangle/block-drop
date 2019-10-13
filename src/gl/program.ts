import {
  ProgramContextAttributeConfig,
  ShaderDictionary,
  ProgramContextConfig,
  ProgramContext,
  ProgramContextAttribute,
  ProgramContextUniform,
} from '../interfaces';
import { Dictionary } from '@ch1/utility';

function configAttributeTypeToRuntime(gl: WebGLRenderingContext, type: string) {
  if ((gl as any)[type] === undefined) {
    throw new Error();
  }
  return (gl as any)[type] as number;
}

function configAttributesToAttributes(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  config: ProgramContextAttributeConfig
) {
  const { name, normalize, offset, size, stride, type } = config;
  const buffer = gl.createBuffer();
  if (!buffer) {
    throw new Error('could not create buffer for attribute: ' + name);
  }

  return {
    buffer,
    location: gl.getAttribLocation(program, name),
    name,
    normalize,
    offset,
    size,
    stride,
    type: configAttributeTypeToRuntime(gl, type),
  };
}

export function createProgramFromConfig(
  shaderDict: ShaderDictionary,
  gl: WebGLRenderingContext,
  config: ProgramContextConfig
): ProgramContext {
  if (!shaderDict[config.shaderNames.vertex]) {
    throw new Error(
      'vertex config ' + config.shaderNames.vertex + ' not found'
    );
  }

  if (!shaderDict[config.shaderNames.fragment]) {
    throw new Error(
      'fragment config ' + config.shaderNames.fragment + ' not found'
    );
  }

  const vertex = shaderDict[config.shaderNames.vertex].vertex;
  const fragment = shaderDict[config.shaderNames.fragment].fragment;

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertex);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragment);
  const program = createProgram(gl, vertexShader, fragmentShader);

  const attributes = config.attributes.reduce(
    (dict: Dictionary<ProgramContextAttribute>, attribute) => {
      dict[attribute.name] = configAttributesToAttributes(
        gl,
        program,
        attribute
      );
      return dict;
    },
    {}
  );

  const uniforms = config.uniforms.reduce(
    (dict: Dictionary<ProgramContextUniform>, uniform) => {
      const { name } = uniform;
      const location = gl.getUniformLocation(program, name);

      if (!location) {
        throw new Error('could not bind location ' + name);
      }

      dict[name] = {
        location,
        name,
      };

      return dict;
    },
    {}
  );

  return {
    attributes,
    canvas: gl.canvas as HTMLCanvasElement,
    gl,
    program,
    shaders: {
      vertex: vertexShader,
      fragment: fragmentShader,
    },
    uniforms,
  };
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
