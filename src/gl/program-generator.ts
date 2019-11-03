import { Dictionary, isNumber } from '@ch1/utility';

export enum GlBindTypes {
  Attribute = 'a_',
  Custom = 'c_',
  Uniform = 'u_',
  Varying = 'v_',
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

export enum GlVertexFunctionSnippets {
  Main1 = 'main.vertex.1.glsl',
}

export enum GlFragmentFunctionSnippets {
  Main1 = 'main.fragment.1.glsl',
  CalcDirFragment1 = 'calc-dir.fragment.1.glsl',
}

export interface VariableDeclarations {
  length?: number;
  name: string;
  varType: GlTypes;
}
export interface Declarations extends VariableDeclarations {
  bindType: GlBindTypes;
}

export interface GlFunctionDescription<
  T extends GlFragmentFunctionSnippets | GlVertexFunctionSnippets
> {
  declarations: VariableDeclarations[];
  name: string;
  returnType: GlTypes;
  snippet: T;
}

export interface ProgramCompiler {
  (customValues?: Dictionary<string>): string;
}

export interface GlSl {
  fragment: ProgramCompiler;
  vertex: ProgramCompiler;
}

export interface ProgramDescription {
  fragmentDeclarations: Declarations[];
  fragmentFunctions: GlFunctionDescription<GlFragmentFunctionSnippets>[];
  vertexDeclarations: Declarations[];
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

const vertexHeader = '';
const fragmentHeader = 'precision mediump float;';

const glBindTypes: { [key in GlBindTypes]: string } = {
  a_: 'attribute',
  c_: 'custom',
  u_: 'uniform',
  v_: 'varying',
};

export function generateProgramGenerators(
  description: ProgramDescription
): GlSl {
  if (description.fragmentDeclarations.length === 0) {
    throw new Error('generateProgramGenerators requires fragmentDeclarations');
  }
  if (description.fragmentFunctions.length === 0) {
    throw new Error('generateProgramGenerators requires fragmentFunctions');
  }
  if (description.vertexDeclarations.length === 0) {
    throw new Error('generateProgramGenerators requires vertexDeclarations');
  }
  if (description.vertexFunctions.length === 0) {
    throw new Error('generateProgramGenerators requires vertexFunctions');
  }
  const snippets = loadSnippets(description);
  const bindings = getBindings(description);
  checkRequirements(description, snippets);
  const fragment = (c: Dictionary<string> = {}) =>
    generate(
      c,
      'fragment',
      bindings.fragment,
      fragmentHeader,
      description.fragmentDeclarations,
      description.fragmentFunctions,
      snippets
    );
  const vertex = (c: Dictionary<string> = {}) =>
    generate(
      c,
      'vertex',
      bindings.vertex,
      vertexHeader,
      description.vertexDeclarations,
      description.vertexFunctions,
      snippets
    );

  return {
    fragment,
    vertex,
  };
}

export function getBindings(descriptions: ProgramDescription) {
  const bindings: ProgramBindingDict = {
    fragment: {
      u_: {},
      v_: {},
    },
    vertex: {
      a_: {},
      u_: {},
      v_: {},
    },
  };

  const sortDeclaration = (type: 'fragment' | 'vertex') => (
    dec: Declarations
  ) => {
    (bindings as any)[type][dec.bindType][dec.name] = dec.name;
  };

  descriptions.fragmentDeclarations.forEach(sortDeclaration('fragment'));
  descriptions.vertexDeclarations.forEach(sortDeclaration('vertex'));

  return bindings;
}

function generate(
  c: Dictionary<string>,
  type: 'fragment' | 'vertex',
  shaderDict: ShaderDict,
  header: string,
  declarations: Declarations[],
  functions: (
    | GlFunctionDescription<GlFragmentFunctionSnippets>
    | GlFunctionDescription<GlVertexFunctionSnippets>)[],
  snippets: ProgramSnippets
) {
  let program = header + '\n';
  program += declarations
    .map(dec => {
      return declareBindingOrStruct(
        dec.bindType,
        dec.varType,
        dec.name,
        dec.length
      );
    })
    .join('\n');

  program += '\n';

  program += functions
    .map(desc => {
      return declareFunction(desc);
    })
    .join('\n');

  program += '\n';

  return (
    program +
    functions
      .map(desc => {
        return implementFunction(
          c,
          shaderDict,
          desc,
          snippets[type][desc.snippet]
        );
      })
      .join('\n\n')
  );
}

/**
 * All ${} template literals found in template must be annotated by type
 * the following annotations:
 *
 * a_variable_name will be checked against attributes
 * c_variable_name will be checked at compile time (outside of scope of thhis funciont)
 * u_variable_name will be checked against uniforms
 * v_variable_name will be checked against varyings
 */
export function checkRequirements(
  description: ProgramDescription,
  snippets: ProgramSnippets
) {
  const checkShader = (sType: 'fragment' | 'vertex') => {
    const sTypeDec: 'fragmentDeclarations' | 'vertexDeclarations' = (sType +
      'Declarations') as 'fragmentDeclarations' | 'vertexDeclarations';
    Object.keys(snippets[sType]).forEach(snippetId => {
      Object.keys(snippets[sType][snippetId].literals).forEach(literalId => {
        checkRequirement(literalId, description[sTypeDec]);
      });
    });
  };

  checkShader('fragment');
  checkShader('vertex');
}

export function checkRequirement(
  literalId: string,
  declarations: Declarations[]
) {
  if (literalId.indexOf('c_') === 0) {
    return;
  }
  const bindType = getBindTypeFromConvention(literalId);
  let found = false;
  declarations.forEach(declaration => {
    if (found) {
      return;
    }
    if (declaration.bindType === bindType) {
      if (literalId === declaration.name) {
        found = true;
      }
    }
  });

  if (found === false) {
    throw new Error('could not find ' + literalId + ' in ' + bindType);
  }
}

export function getBindTypeFromConvention(name: string): GlBindTypes {
  const result = Object.keys(GlBindTypes).reduce(
    (s: boolean | GlBindTypes, prefix: string) => {
      if (s) {
        return s;
      }

      if (name.indexOf((GlBindTypes as any)[prefix as any]) === 0) {
        return (GlBindTypes as any)[prefix as any] as GlBindTypes;
      }

      return s;
    },
    false
  );

  if (!result) {
    throw new Error(
      'Could not find ' +
        name +
        ' in attributes, uniforms, or varyings.  If it is a custom variable, please prefix it with "c_"'
    );
  }

  return result as GlBindTypes;
}

function loadSnippet(name: string): ProgramSnippet {
  const snippet = require('./shader-snippets/' + name);
  if (!snippet) {
    throw new Error('loadSnippet could not find ' + name);
  }
  const literals = getTemplateLiterals(snippet);

  return {
    literals,
    snippet,
  };
}

function loadSnippets(description: ProgramDescription): ProgramSnippets {
  const fragment: Dictionary<ProgramSnippet> = {};
  const vertex: Dictionary<ProgramSnippet> = {};
  const ls = (d: Dictionary<ProgramSnippet>) => (
    desc: GlFunctionDescription<
      GlFragmentFunctionSnippets | GlVertexFunctionSnippets
    >
  ) => (d[desc.snippet] = loadSnippet(desc.snippet));
  description.fragmentFunctions.forEach(ls(fragment));
  description.vertexFunctions.forEach(ls(vertex));

  return {
    fragment,
    vertex,
  };
}

export function implementFunction(
  c: Dictionary<string>,
  shaderDict: ShaderDict,
  fnDesc: GlFunctionDescription<
    GlFragmentFunctionSnippets | GlVertexFunctionSnippets
  >,
  snippet: ProgramSnippet
) {
  const start = declareFunctionStart(fnDesc) + ' {\n';
  const compiled = Object.keys(snippet.literals).reduce((str, literalId) => {
    const bindType = getBindTypeFromConvention(literalId);
    let dict: Dictionary<string> = {};
    if (bindType === GlBindTypes.Custom) {
      if (!c[literalId]) {
        throw new Error(
          'glsl function ' + fnDesc.name + ' requires a value for ' + literalId
        );
      }
      dict = c;
    } else {
      dict = shaderDict[bindType] as Dictionary<string>;
    }
    const strPos = snippet.literals[literalId];
    return strPos.reduce((s, el) => {
      return s.slice(0, el.start) + dict[literalId] + s.slice(el.end + 1);
    }, str);
  }, snippet.snippet);
  const trimmed =
    compiled.split('')[compiled.length - 1] === '\n'
      ? compiled.slice(0, compiled.length - 1)
      : compiled;
  return `${start} ${pad(trimmed)}\n}`;
}

export function declareFunction(
  fnDesc: GlFunctionDescription<
    GlFragmentFunctionSnippets | GlVertexFunctionSnippets
  >
) {
  if (fnDesc.name === 'main') {
    return '';
  }
  return declareFunctionStart(fnDesc) + ';';
}

export function declareFunctionStart(
  fnDesc: GlFunctionDescription<
    GlFragmentFunctionSnippets | GlVertexFunctionSnippets
  >
) {
  const vars = fnDesc.declarations.map(desc => {
    return declareVariable(desc.varType, desc.name, desc.length);
  });
  return `${fnDesc.returnType} ${fnDesc.name}(${vars.join(', ')})`;
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
    return `${glBindTypes[bindType]} ${declareVariable(varType, name, length)}`;
  } else {
    return `${glBindTypes[bindType]} ${declareVariable(
      varType,
      name,
      length
    )};`;
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

export function getTemplateLiterals(
  source: string
): Dictionary<ProgramStringPosition[]> {
  const openToken = '${';
  let parsed = source;
  let first = parsed.indexOf(openToken);
  let delta = 0;
  const values: Dictionary<ProgramStringPosition[]> = {};
  while (first > -1) {
    const close = parsed.slice(first).indexOf('}');
    if (close === -1) {
      const start = first < 25 ? 0 : first - 24;
      const finish = first + 25 >= parsed.length ? parsed.length : first + 25;
      throw new Error(
        'Unclosed template string starting at ' + parsed.slice(start, finish)
      );
    }
    const slice = parsed.slice(first + 2, first + close);
    const name = slice.trim();
    if (values[name] === undefined) {
      values[name] = [];
    }
    values[name].push({ start: first + delta, end: close + first + delta });
    delta += slice.length + 2;

    parsed = parsed.slice(0, first) + parsed.slice(first + close + 1);
    first = parsed.indexOf(openToken);
  }

  return values;
}

function pad(str: string) {
  return str
    .split('\n')
    .map(line => '  ' + line)
    .join('\n');
}
