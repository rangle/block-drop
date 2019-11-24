import { Dictionary } from '@ch1/utility';
import {
  Matrix4_4,
  ShapeDirectionalLight,
  ShapePointLight,
  ShapeSpotLight,
} from '../interfaces';

/**
 *
 *
 * Gl Program Generator
 *
 *
 */
export enum GlBindTypes {
  Attribute = 'a_',
  Custom = 'c_',
  Uniform = 'u_',
  Varying = 'v_',
}

export enum GlTypes {
  Struct = 'custom',
  Int = 'int',
  Float = 'float',
  Mat4 = 'mat4',
  Sampler2d = 'sampler2D',
  StructDeclaration = 'struct',
  Vec2 = 'vec2',
  Vec3 = 'vec3',
  Vec4 = 'vec4',
  Void = 'void',
}

export enum GlVertexFunctionSnippets {
  Main1 = 'main.vertex.1.glsl',
  Main2 = 'main.vertex.2.glsl',
  Main3 = 'main.vertex.3.glsl',
  Main4 = 'main.vertex.4.glsl',
  MoveColour = 'move-colour.vertex.1.glsl',
  MoveDirLight = 'move-dir-light.vertex.1.glsl',
  MoveTexture = 'move-texture.vertex.1.glsl',
}

export enum GlFragmentFunctionSnippets {
  Main1 = 'main.fragment.1.glsl',
  Main2 = 'main.fragment.2.glsl',
  Main3 = 'main.fragment.3.glsl',
  Main4 = 'main.fragment.4.glsl',
  Main5 = 'main.fragment.5.glsl',
  Main6 = 'main.fragment.6.glsl',
  CalcDirFragment1 = 'calc-dir.fragment.1.glsl',
  CalcPointFragment1 = 'calc-point.fragment.1.glsl',
}

export interface VariableDeclaration {
  length?: Declaration[] | number;
  name: string;
  varType: GlTypes;
}
export interface Declaration extends VariableDeclaration {
  bindType: GlBindTypes;
}

export interface GlFunctionDescription<
  T extends GlFragmentFunctionSnippets | GlVertexFunctionSnippets
> {
  declarations: VariableDeclaration[];
  name: string;
  returnType: GlTypes;
  snippet: T;
}

export interface ProgramGenerator {
  (customValues?: Dictionary<string>): string;
}

export interface GlSl {
  fragment: ProgramGenerator;
  vertex: ProgramGenerator;
}

export interface ProgramGeneratorDescription {
  fragmentDeclarations: Declaration[];
  fragmentFunctions: GlFunctionDescription<GlFragmentFunctionSnippets>[];
  vertexDeclarations: Declaration[];
  vertexFunctions: GlFunctionDescription<GlVertexFunctionSnippets>[];
}

export interface ProgramLiteralPosition {
  name: string;
  position: ProgramStringPosition;
}

export interface ProgramSnippet {
  literals: Dictionary<ProgramStringPosition[]>;
  snippet: string;
  sortedLiterals: ProgramLiteralPosition[];
}

export interface ProgramSnippets {
  fragment: Dictionary<ProgramSnippet>;
  vertex: Dictionary<ProgramSnippet>;
}

export interface ShaderDict {
  a_?: Dictionary<string>;
  u_: Dictionary<string>;
  v_: Dictionary<string>;
}

export interface ProgramBindingDict {
  fragment: ShaderDict;
  vertex: ShaderDict;
}

export interface ProgramStringPosition {
  end: number;
  start: number;
}

/**
 *
 *
 * Gl Program Compiler
 *
 *
 */

export interface ProgramContextAttributeBase {
  name: string;
  normalize: boolean;
  size: number;
  stride: number;
  offset: number;
}

export interface ProgramContextAttribute extends ProgramContextAttributeBase {
  location: number;
  type: number;
}

export interface ProgramAttributeDeclaration extends Declaration {
  glType: string;
  normalize: boolean;
  offset: number;
  size: number;
  stride: number;
}

export interface ProgramAttribute extends ProgramAttributeDeclaration {
  location: number;
  type: number;
}

export interface ProgramCompilerDescription
  extends ProgramGeneratorDescription {
  fragmentDeclarations: (Declaration | ProgramAttributeDeclaration)[];
  vertexDeclarations: (Declaration | ProgramAttributeDeclaration)[];
}

export interface AttributeSetter {
  (buffer: WebGLBuffer): void;
}

// export type UniformSetter = ((uniformData: number) => void) | ((uniformData: number[]) => void) | ((uniformData: Matrix3_1) => void) | ((uniformData: Matrix4_1) => void) | ((uniformData: Matrix4_4) => void) | ((uniformData: Float32Array) => void) | ((uniformData: Uint8Array) => void);

export interface UniformSetter {
  (uniformData: any): void;
}

export interface GlProgram {
  attributes: Dictionary<AttributeSetter>;
  description: ProgramCompilerDescription;
  program: WebGLProgram;
  uniforms: Dictionary<UniformSetter>;
  fragmentShader: string;
  vertexShader: string;
}

/**
 *
 *
 * Provider
 *
 */

export interface Provider<Type, TConfig> {
  debug(): string;
  get(name: string, key?: string): null | Type;
  register(name: string, config: TConfig, eager?: boolean): void;
}

/**
 *
 *
 * Renderer
 *
 */

export interface ShapeLite {
  local: Matrix4_4;
  material?: string;
  mesh: string;
  programPreference?: string;
}

export interface Lights {
  directionals: ShapeDirectionalLight[];
  points: ShapePointLight[];
  spots: ShapeSpotLight[];
}
