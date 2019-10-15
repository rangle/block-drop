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
  lightDirection?: Matrix3_1;
  programName: string;
  normalsDataName?: string;
}

export interface Shape {
  a_colour: WebGLBuffer;
  context: ProgramContext;
  lightDirection: Matrix3_1;
  a_normal?: WebGLBuffer;
  a_position: WebGLBuffer;
  vertexCount: number;
}

export type BufferMap = Map<Float32Array | Uint8Array, WebGLBuffer>;

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

/**
 *
 *
 * Scene Graph
 *
 *
 */
export interface TRS {
  rotation: Matrix3_1;
  scale: Matrix3_1;
  translation: Matrix3_1;
}
export interface SceneGraph extends TRS {
  children: SceneGraph[];
  localMatrix: Matrix4_4;
  name: string;
  op3_1: ObjectPool<Matrix3_1>;
  op4_4: ObjectPool<Matrix4_4>;
  parent: SceneGraph | null;
  shape?: Shape;
  worldMatrix: Matrix4_4;
  setParent(parent: null | SceneGraph): void;
  toArray(): SceneGraphShape[];
  updateLocalMatrix(): void;
  updateWorldMatrix(): void;
  walk(callback: (s: SceneGraph) => void): void;
}

export interface SceneGraphShape extends SceneGraph {
  shape: Shape;
}

export interface SceneConfig {
  children: SceneConfig[];
  initialRotation?: Matrix3_1;
  initialScale?: Matrix3_1;
  initialTranslation?: Matrix3_1;
  name: string;
  shape?: ShapeConfig;
}

/**
 *
 *
 * Object Pool
 *
 */
export interface ObjectPool<T> {
  free(obj: T): void;
  malloc(): T;
}
