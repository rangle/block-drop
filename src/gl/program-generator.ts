import { Dictionary, isNumber, objReduce } from '@ch1/utility';
import {
  GlBindTypes,
  ProgramGeneratorDescription,
  GlSl,
  ProgramBindingDict,
  Declaration,
  ShaderDict,
  GlFunctionDescription,
  GlFragmentFunctionSnippets,
  GlVertexFunctionSnippets,
  ProgramSnippets,
  ProgramSnippet,
  GlTypes,
  ProgramStringPosition,
  ProgramLiteralPosition,
} from './interfaces';

const vertexHeader = '';
const fragmentHeader = 'precision mediump float;';

const glBindTypes: { [key in GlBindTypes]: string } = {
  a_: 'attribute',
  c_: 'custom',
  u_: 'uniform',
  v_: 'varying',
};

export function generateProgramGenerators(
  description: ProgramGeneratorDescription
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

export function getBindings(descriptions: ProgramGeneratorDescription) {
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
    dec: Declaration
  ) => {
    if (dec.varType === GlTypes.Struct) {
      const name = varNameFromProp(dec.name);
      (bindings as any)[type][dec.bindType][name] = name;
    } else {
      (bindings as any)[type][dec.bindType][dec.name] = dec.name;
    }
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
  declarations: Declaration[],
  functions: (
    | GlFunctionDescription<GlFragmentFunctionSnippets>
    | GlFunctionDescription<GlVertexFunctionSnippets>)[],
  snippets: ProgramSnippets
) {
  let program = header + '\n';
  const orderedDeclarations = declarations.reduce(
    (arr: Declaration[], next) => {
      if (next.varType === GlTypes.StructDeclaration) {
        arr.unshift(next);
      } else {
        arr.push(next);
      }
      return arr;
    },
    []
  );
  program += orderedDeclarations
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
  description: ProgramGeneratorDescription,
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
  declarations: Declaration[]
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
      if (declaration.varType === GlTypes.Struct) {
        if (literalId === varNameFromProp(declaration.name)) {
          found = true;
        }
      } else {
        if (literalId === declaration.name) {
          found = true;
        }
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

function insertNewLines(str: string) {
  return str.replace(';', ';\n');
}

function loadSnippet(name: string): ProgramSnippet {
  const snippet = insertNewLines(require('./shader-snippets/' + name));
  if (!snippet) {
    throw new Error('loadSnippet could not find ' + name);
  }
  const literals = getTemplateLiterals(snippet);
  const sortedLiterals = sortLiterals(literals);

  return {
    literals,
    snippet,
    sortedLiterals,
  };
}

function sortLiterals(
  literals: Dictionary<ProgramStringPosition[]>
): ProgramLiteralPosition[] {
  return objReduce(
    literals,
    (
      arr: ProgramLiteralPosition[],
      positions: ProgramStringPosition[],
      name: string
    ) => {
      return arr.concat(
        positions.map(position => {
          return {
            name,
            position,
          };
        })
      );
    },
    []
  ).sort((a, b) => {
    if (a.position.start < b.position.start) {
      return -1;
    }
    if (a.position.start > b.position.start) {
      return 1;
    }
    return 0;
  });
}

function loadSnippets(
  description: ProgramGeneratorDescription
): ProgramSnippets {
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

  let delta = 0;
  const compiled = snippet.sortedLiterals.reduce((str, { name, position }) => {
    const literalId = name;
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
      if (!dict[literalId]) {
        throw new RangeError(
          'glsl function ' + fnDesc.name + ' requires a value for ' + literalId
        );
      }
    }

    const start = position.start - delta;
    const end = position.end - delta;
    const newStr = str.slice(0, start) + dict[literalId] + str.slice(end + 1);

    delta += Math.abs(end - start) - dict[literalId].length;

    return newStr;
  }, snippet.snippet);
  const trimmed =
    compiled.split('')[compiled.length - 1] === '\n'
      ? compiled.slice(0, compiled.length - 1)
      : compiled;
  return `${start}${pad(trimmed)}\n}`;
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
    if (Array.isArray(desc.length)) {
      return declareVariable(desc.varType, desc.name);
    } else {
      return declareVariable(desc.varType, desc.name, desc.length);
    }
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
  lengthOrDeclarations: Declaration[] | number = 0
): string {
  const length = isNumber(lengthOrDeclarations) ? lengthOrDeclarations : 0;
  if (varType === GlTypes.StructDeclaration) {
    throwOnStruct(bindType);
    if (isNumber(lengthOrDeclarations)) {
      throw new TypeError("declare expected a struct's members");
    }
    const declarations = lengthOrDeclarations.map(dec => {
      if (Array.isArray(dec.length)) {
        return pad(declareVariable(dec.varType, dec.name) + ';');
      } else {
        return pad(declareVariable(dec.varType, dec.name, dec.length) + ';');
      }
    });
    return `struct ${structNameFromProp(name)} {
${declarations.join('\n')}
};`;
  } else if (varType === GlTypes.Struct) {
    throwOnStruct(bindType);
    return `${glBindTypes[bindType]} ${declareVariable(
      varType,
      name,
      length
    )};`;
  } else {
    return `${glBindTypes[bindType]} ${declareVariable(
      varType,
      name,
      length
    )};`;
  }
}

/**
 * conventions:
 *
 *  u_structType_yourName
 *    -> StructType
 *  a_structType_yourName
 *    -> StructType
 *  a_structType
 *    -> StructType
 *  structType
 *    -> StructType
 *  structType_yourName
 *    -> StructType
 *
 */
export function structNameFromProp(str: string): string {
  let newStr = stripBindType(str);
  newStr = newStr.split('_')[0];
  return newStr.slice(0, 1).toUpperCase() + newStr.slice(1);
}

export function varNameFromProp(str: string): string {
  const prefix = getBindType(str);
  const parts = str.slice(prefix.length).split('_');
  return parts.length === 1
    ? prefix + parts[0]
    : prefix + parts.slice(1).join('_');
}

function stripBindType(str: string): string {
  const prefix = str.slice(0, 2);
  let newStr = '';
  switch (prefix) {
    case GlBindTypes.Attribute:
    case GlBindTypes.Custom:
    case GlBindTypes.Uniform:
    case GlBindTypes.Varying:
      newStr = str.slice(2);
      break;
    default:
      newStr = str;
  }

  return newStr;
}

function getBindType(str: string): string {
  const prefix = str.slice(0, 2);
  switch (prefix) {
    case GlBindTypes.Attribute:
    case GlBindTypes.Custom:
    case GlBindTypes.Uniform:
    case GlBindTypes.Varying:
      return prefix;
    default:
      return '';
  }
}

/**
 * declares a variable
 */
export function declareVariable(varType: GlTypes, name: string, length = 0) {
  if (varType === GlTypes.StructDeclaration) {
    throw new TypeError(
      'declareVariable: cannot declare a struct declaration, use Struct instead'
    );
  }
  const vt = varType === GlTypes.Struct ? structNameFromProp(name) : varType;
  const finalName = varType === GlTypes.Struct ? varNameFromProp(name) : name;
  const l = length < 0 ? 0 : length;
  return l >= 1 ? `${vt} ${finalName}[${l}]` : `${vt} ${finalName}`;
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
