import { Dictionary } from '@ch1/utility';
/**
 *
 *
 * Matrices
 *
 *
 */
export type Matrix3_1 = [number, number, number];
export type Matrix3_2 = [number, number, number, number, number, number];
export type Matrix3_3 = [
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number,
  number
];
export type Matrix4_1 = [number, number, number, number];
export type Matrix4_4 = Float32Array;

export interface DataDictionary {
  [key: string]: Float32Array | Uint8Array;
}

/**
 *
 *
 * GL Shapes
 *
 *
 */
export interface ShapeConfig {
  positionsDataName: string;
  coloursDataName: string;
  programName: string;
}

export interface Shape {
  colours: Float32Array | Uint8Array;
  context: ProgramContext;
  positions: Float32Array | Uint8Array;
}

/**
 *
 *
 * GL Programs
 *
 *
 */

export interface ProgramDictionary {
  [key: string]: ProgramContext;
}

export interface ShaderDictionary {
  [key: string]: {
    fragment: string;
    vertex: string;
  };
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
  location: number;
  type: number;
}

export interface ProgramContextUniform {
  name: string;
  location: WebGLUniformLocation;
}

export interface ProgramContext {
  attributes: Dictionary<ProgramContextAttribute>;
  canvas: HTMLCanvasElement;
  gl: WebGLRenderingContext;
  program: WebGLProgram;
  shaders: {
    fragment: WebGLShader;
    vertex: WebGLShader;
  };
  uniforms: Dictionary<ProgramContextUniform>;
}
