import { Dictionary, isNumber, isString } from '@ch1/utility';

export enum GlBindTypes {
  Attribute = 'attribute',
  Uniform = 'uniform',
  Varying = 'varying',
}

export enum GlTypes {
  Custom = 'custom',
  Int = 'int',
  Float = 'float',
  Mat4 = 'mat4',
  Struct = 'struct',
  Vec3 = 'vec3',
  Vec4 = 'vec4',
}

export enum GlVertexMainSnippets {
  Main1 = 'main.vertex.1.glsl',
}

export enum GlFragmentMainSnippets {
  Main1 = 'main.vertex.1.glsl',
}

export enum GlVertexFunctionSnippets {}

export enum GlFragmentFunctionSnippets {}

export interface Declarations {
  bindType: GlBindTypes;
  length?: number;
  name: string;
  varType: GlTypes;
}

export interface GlFunctionDescription<
  T extends GlFragmentFunctionSnippets | GlVertexFunctionSnippets
> {
  declarations: Declarations[];
  name: string;
  returnType: GlTypes;
  snippet: T;
}

export interface GlSl {
  fragment: string;
  vertex: string;
}

export interface ProgramDescription {
  fragmentDeclarations: Declarations[];
  fragmentFunctions: GlFunctionDescription<GlFragmentFunctionSnippets>[];
  fragmentMain: GlFragmentMainSnippets;
  vertexDeclarations: Declarations[];
  vertexFunctions: GlFunctionDescription<GlVertexFunctionSnippets>[];
  vertexMain: GlVertexMainSnippets;
}

const fragmentHeader = 'precision mediump float;';

function isDeclarations(thing: any): thing is Declarations {
  if (isString(thing.name) && thing.bindType && thing.varType) {
    return true;
  }
  return false;
}

export function generateProgram(description: ProgramDescription): GlSl {
  return {
    fragment,
    vertex,
  };
}

function loadSnippet(name: string) {
  return require('./shader-snippets/' + name);
}

export function implementFunction(
  fnDesc: GlFunctionDescription<
    GlFragmentFunctionSnippets | GlVertexFunctionSnippets
  >
) {
  const start = declareFunctionStart(fnDesc) + ' {\n';
  const snippetName: string = (fnDesc.snippet as any) as string;
  return `${start} ${pad(loadSnippet(snippetName))}\n}`;
}

export function declareFunction(
  fnDesc: GlFunctionDescription<
    GlFragmentFunctionSnippets | GlVertexFunctionSnippets
  >
) {
  return declareFunctionStart(fnDesc) + ';';
}

export function declareFunctionStart(
  fnDesc: GlFunctionDescription<
    GlFragmentFunctionSnippets | GlVertexFunctionSnippets
  >
) {
  const vars = fnDesc.declarations.map((desc, i) => {
    return i === fnDesc.declarations.length - 1
      ? declareVariable(desc.varType, desc.name, desc.length)
      : declareVariable(desc.varType, desc.name, desc.length) + ',';
  });
  return `${fnDesc.returnType} ${fnDesc.name}(${vars})`;
}

function throwOnStruct(bindType: GlBindTypes) {
  const badStructAttribute = 'declare: attribute structs are not supported';
  const badStructVarying = 'declare: varying structs are not supported';
  if (bindType === GlBindTypes.Attribute) {
    throw new TypeError(badStructAttribute);
  }
  if (bindType === GlBindTypes.Varying) {
    throw new TypeError(badStructVarying);
  }
}

/**
 * @note Does not support nested structs
 */
export function declareBindingOrStruct(
  bindType: GlBindTypes,
  varType: GlTypes,
  name: string,
  lengthOrDeclarations: Declarations[] | number = 1
): string {
  const length = isNumber(lengthOrDeclarations) ? lengthOrDeclarations : 1;
  if (varType === GlTypes.Struct) {
    throwOnStruct(bindType);
    if (isNumber(lengthOrDeclarations)) {
      throw new TypeError("declare expected a struct's members");
    }
    const declarations = lengthOrDeclarations.map(dec => {
      return pad(declareVariable(dec.varType, dec.name, dec.length) + ';');
    });
    return `struct ${upperCaseFirstLetter(name)} {
${declarations.join('\n')}
}`;
  } else if (varType === GlTypes.Custom) {
    throwOnStruct(bindType);
    return `${bindType} ${declareVariable(varType, name, length)}`;
  } else {
    return `${bindType} ${declareVariable(varType, name, length)};`;
  }
}

function upperCaseFirstLetter(str: string): string {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
}

/**
 * declares a variable
 */
export function declareVariable(varType: GlTypes, name: string, length = 1) {
  if (varType === GlTypes.Struct) {
    throw new TypeError(
      'declareVariable: cannot declare a struct, use Custom instead'
    );
  }
  const vt = varType === GlTypes.Custom ? upperCaseFirstLetter(name) : varType;
  const l = length < 1 ? 1 : length;
  return l > 1 ? `${vt} ${name}[${l}]` : `${vt} ${name}`;
}

export function getTemplateLiterals(source: string): string[] {
  const openToken = '${';
  let parsed = source;
  let first = parsed.indexOf(openToken);
  const values: Dictionary<boolean> = {};
  while (first > -1) {
    const close = parsed.slice(first).indexOf('}');
    if (close === -1) {
      const start = first < 25 ? 0 : first - 24;
      const finish = first + 25 >= parsed.length ? parsed.length : first + 25;
      throw new Error(
        'Unclosed template string starting at ' + parsed.slice(start, finish)
      );
    }
    const name = parsed.slice(first + 2, first + close).trim();
    values[name] = true;

    parsed = parsed.slice(0, first) + parsed.slice(first + close + 1);
    first = parsed.indexOf(openToken);
  }

  return Object.keys(values);
}

function pad(str: string) {
  return str
    .split('\n')
    .map(line => '  ' + line)
    .join('\n');
}
