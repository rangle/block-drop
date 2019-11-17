import { Dictionary } from '@ch1/utility';

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
  StructDeclaration = 'struct',
  Vec3 = 'vec3',
  Vec4 = 'vec4',
  Void = 'void',
}

export enum GlVertexFunctionSnippets {
  Main1 = 'main.vertex.1.glsl',
}

export enum GlFragmentFunctionSnippets {
  Main1 = 'main.fragment.1.glsl',
  CalcDirFragment1 = 'calc-dir.fragment.1.glsl',
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

export interface ProgramSnippet {
  literals: Dictionary<ProgramStringPosition[]>;
  snippet: string;
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