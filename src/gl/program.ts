export interface ShaderDictionary {
  [key: string]: {
    fragment: string;
    vertex: string;
  };
}

export interface DataDictionary {
  [key: string]: Float32Array | Uint8Array;
}

export interface ProgramContextAttributeBase {
  name: string;
  normalize: boolean;
  size: number;
  stride: number;
  offset: number;
}

export interface ProgramContextAttributeConfig
  extends ProgramContextAttributeBase {
  dataName: string;
  type: string;
}

export interface ProgramContextConfig {
  attributes: ProgramContextAttributeConfig[];
  shaderNames: {
    fragment: string;
    vertex: string;
  };
  uniforms: {
    name: string;
  }[];
}

export interface ProgramContextAttribute extends ProgramContextAttributeBase {
  buffer: WebGLBuffer;
  data: Float32Array | Uint8Array;
  location: number;
  type: number;
}

export interface ProgramContext {
  attributes: ProgramContextAttribute[];
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  shaders: {
    fragment: WebGLShader;
    vertex: WebGLShader;
  };
  uniforms: {
    name: string;
    location: WebGLUniformLocation;
  }[];
}

function configAttributeTypeToRuntime(gl: WebGLRenderingContext, type: string) {
  if ((gl as any)[type] === undefined) {
    throw new Error();
  }
  return (gl as any)[type] as number;
}

function configAttributesToAttributes(
  dataDict: DataDictionary,
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  config: ProgramContextAttributeConfig
) {
  const { dataName, name, normalize, offset, size, stride, type } = config;
  const buffer = gl.createBuffer();
  if (!buffer) {
    throw new Error('could not create buffer for attribute: ' + name);
  }
  if (!dataDict[dataName]) {
    throw new Error('could not find attribute data: ' + dataName);
  }
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, dataDict[dataName], gl.STATIC_DRAW);

  return {
    buffer,
    data: dataDict[dataName],
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
  dataDict: DataDictionary,
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

  const attributes = config.attributes.map(attribute => {
    return configAttributesToAttributes(dataDict, gl, program, attribute);
  });

  const uniforms = config.uniforms.map(uniform => {
    const { name } = uniform;
    const location = gl.getUniformLocation(program, name);

    if (!location) {
      throw new Error('could not bind location ' + name);
    }

    return {
      location,
      name,
    };
  });

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
