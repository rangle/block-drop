import {
  Declaration,
  GlBindTypes,
  GlSl,
  GlTypes,
  ProgramCompilerDescription,
  GlProgram,
  AttributeSetter,
  ProgramAttributeDeclaration,
  UniformSetter,
  ProgramAttribute,
} from './interfaces';
import { Dictionary, objReduce, isNumber } from '@ch1/utility';
import { Matrix3_1, Matrix4_4, Matrix4_1 } from '../interfaces';
import { varNameFromProp, structNameFromProp } from './program-generator';

export function generateAndCreateProgram(
  gl: WebGLRenderingContext,
  description: ProgramCompilerDescription,
  generator: GlSl,
  customValues: Dictionary<string> = {}
): GlProgram {
  const vertexShaderRaw = generator.vertex(customValues);
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderRaw);
  const fragmentShaderRaw = generator.fragment(customValues);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderRaw
  );
  const program = createProgram(gl, vertexShader, fragmentShader);
  const attributesMeta = createAttributes(gl, program, description);
  const uniformBuilder = UniformBuilder.create(gl, program, description);
  const uniforms = uniformBuilder.build();

  const attributes = objReduce(
    attributesMeta,
    (dict: Dictionary<AttributeSetter>, next) => {
      dict[next.name] = (buffer: WebGLBuffer) => {
        gl.enableVertexAttribArray(next.location);
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.vertexAttribPointer(
          next.location,
          next.size,
          next.type,
          next.normalize,
          next.stride,
          next.offset
        );
      };
      return dict;
    },
    {}
  );

  return {
    attributes,
    description,
    fragmentShader: fragmentShaderRaw,
    program,
    uniforms,
    vertexShader: vertexShaderRaw,
  };
}

function isProgramAttributeDeclaration(
  thing: any
): thing is ProgramAttributeDeclaration {
  if (thing.bindType) {
    if (thing.bindType === GlBindTypes.Attribute) {
      return true;
    }
  }
  return false;
}

function setDefaultAttribParams(def: ProgramAttributeDeclaration) {
  if (def.normalize === undefined) {
    def.normalize = false;
  }
  if (def.size === undefined) {
    def.size = 3;
  }
  if (def.stride === undefined) {
    def.stride = 0;
  }
  if (def.offset === undefined) {
    def.offset = 0;
  }
}

export class UniformBuilder {
  private structMembers: Dictionary<Declaration[]> = {};

  static create(
    gl: WebGLRenderingContext,
    program: WebGLProgram,
    description: ProgramCompilerDescription
  ) {
    return new UniformBuilder(gl, program, description);
  }

  constructor(
    private gl: WebGLRenderingContext,
    private program: WebGLProgram,
    private description: ProgramCompilerDescription
  ) {
    const onDec = (
      structMembers: Dictionary<Declaration[]>,
      dec: Declaration
    ) => {
      if (dec.varType === GlTypes.StructDeclaration) {
        if (Array.isArray(dec.length)) {
          const name = structNameFromProp(dec.name);
          structMembers[name] = [];
          dec.length.forEach(nested => {
            if (nested.varType === GlTypes.StructDeclaration) {
              return;
            }
            if (nested.varType === GlTypes.Struct) {
              throw new TypeError('nested structs not supported yet');
            }
            structMembers[name].push(nested);
          });
        }
      }

      return structMembers;
    };
    description.fragmentDeclarations.reduce(onDec, this.structMembers);
    description.vertexDeclarations.reduce(onDec, this.structMembers);
  }

  build(): Dictionary<UniformSetter> {
    return this.createUniforms();
  }

  private createUniforms() {
    const locations: Dictionary<UniformSetter> = {};
    const onDec = (dec: Declaration) => {
      if (dec.bindType === GlBindTypes.Uniform) {
        this.createUniform(locations, dec);
      }
    };
    this.description.fragmentDeclarations.forEach(onDec);
    this.description.vertexDeclarations.forEach(onDec);

    return locations;
  }

  private createUniform(
    locations: Dictionary<UniformSetter>,
    dec: Declaration,
    name = dec.name
  ) {
    if (dec.varType === GlTypes.StructDeclaration) {
      return;
    }

    if (dec.varType === GlTypes.Struct) {
      this.createStruct(locations, dec);
      return;
    }

    if (isNumber(dec.length)) {
      const length = dec.length <= 0 ? 1 : dec.length;
      if (length > 1) {
        this.createArray(locations, dec, length, name);
      } else {
        this.createScalar(locations, dec, name);
      }
    } else {
      if (Array.isArray(dec.length)) {
        throw new TypeError(
          'createUniform: unexpected declarations on ' + dec.name
        );
      }
      this.createScalar(locations, dec, name);
    }
  }

  private createArray(
    locations: Dictionary<UniformSetter>,
    dec: Declaration,
    length: number,
    name = ''
  ) {
    for (let i = 0; i <= length; i += 1) {
      this.createUniform(
        locations,
        { ...dec, length: undefined },
        name + '[' + i + ']'
      );
    }
  }

  private createScalar(
    locations: Dictionary<UniformSetter>,
    dec: Declaration,
    name = ''
  ) {
    const location = this.gl.getUniformLocation(this.program, name);

    if (!location) {
      throw new Error('could not bind location ' + name);
    }

    const scalarWarning = 'use createScalarUniform with scalars only';

    if (dec.length) {
      throw new TypeError(scalarWarning);
    }

    switch (dec.varType) {
      case GlTypes.Struct:
        throw new TypeError(scalarWarning);
      case GlTypes.Float:
        locations[name] = (data: number) => {
          this.gl.uniform1f(location, data);
        };
        break;
      case GlTypes.Int:
        locations[name] = (data: number) => {
          this.gl.uniform1i(location, data);
        };
        break;
      case GlTypes.Mat4:
        locations[name] = (data: Matrix4_4) => {
          this.gl.uniformMatrix4fv(location, false, data);
        };
        break;
      case GlTypes.StructDeclaration:
        throw new TypeError(scalarWarning);
      case GlTypes.Vec3:
        locations[name] = (data: Matrix3_1) => {
          this.gl.uniform3fv(location, data);
        };
        break;
      case GlTypes.Vec4:
        locations[name] = (data: Matrix4_1) => {
          this.gl.uniform4fv(location, data);
        };
        break;
      default:
        throw new TypeError('unsupported varType, internal defect.');
    }
  }

  private createStruct(locations: Dictionary<UniformSetter>, dec: Declaration) {
    const structName = structNameFromProp(dec.name);
    const varName = varNameFromProp(dec.name);
    if (isNumber(dec.length)) {
      const length = dec.length <= 1 ? 1 : dec.length;
      if (length === 1) {
        this.structMembers[structName].forEach(member => {
          this.createScalar(locations, member, varName + '.' + member.name);
        });
      } else {
        for (let i = 0; i <= length; i += 1) {
          this.structMembers[structName].forEach(member => {
            this.createScalar(
              locations,
              member,
              varName + `[${i}].${member.name}`
            );
          });
        }
      }
    } else {
      this.structMembers[structName].forEach(member => {
        this.createScalar(locations, member, varName + '.' + member.name);
      });
    }
  }
}

function createAttributes(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  desc: ProgramCompilerDescription
) {
  return desc.vertexDeclarations.reduce(
    (d: Dictionary<ProgramAttribute>, dec) => {
      if (isProgramAttributeDeclaration(dec)) {
        setDefaultAttribParams(dec);
        d[dec.name] = createAttribute(gl, program, dec);
      }
      return d;
    },
    {}
  );
}

function createAttribute(
  gl: WebGLRenderingContext,
  program: WebGLProgram,
  config: ProgramAttributeDeclaration
): ProgramAttribute {
  const { glType, name } = config;

  return {
    location: gl.getAttribLocation(program, name),
    type: pluckGlProp(gl, glType),
    ...config,
  };
}

function pluckGlProp(gl: WebGLRenderingContext, type: string) {
  if ((gl as any)[type] === undefined) {
    throw new Error('gl prop ' + type + ' not found');
  }
  return (gl as any)[type] as number;
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
