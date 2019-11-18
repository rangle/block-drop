import {
  Provider,
  GlProgram,
  ProgramCompilerDescription,
  GlSl,
} from './interfaces';
import { Dictionary, objReduce } from '@ch1/utility';
import { generateProgramGenerators } from './program-generator';
import { generateAndCreateProgram } from './program-compiler';

const emptyValues = {};
const emptyValuesKey = JSON.stringify(emptyValues);

export class ProgramProvider
  implements Provider<GlProgram, ProgramCompilerDescription> {
  static create(gl: WebGLRenderingContext) {
    return new ProgramProvider(gl);
  }

  private programs: Dictionary<{
    config: ProgramCompilerDescription;
    glsl: GlSl;
    programs: Dictionary<GlProgram>;
  }> = {};

  constructor(private gl: WebGLRenderingContext) {}

  debug() {
    return objReduce(
      this.programs,
      (str: string, programContainer) => {
        return objReduce(
          programContainer.programs,
          (inStr: string, program) => {
            inStr +=
              'Vertex Shader:\n\n' +
              program.vertexShader +
              '\n\n\nFragment Shader:\n\n' +
              program.fragmentShader;
            return inStr;
          },
          str
        );
      },
      ''
    );
  }

  /**
   * @param programName
   * @param key JSON.stringify your config or use an arbitrary key
   */
  get(programName: string, key = emptyValuesKey) {
    if (this.programs[programName]) {
      if (!this.programs[programName].programs[key]) {
        throw new RangeError(
          'ProgramProvider: no program initialized for ' +
            programName +
            ' with key: ' +
            key
        );
      }
      return this.programs[programName].programs[key];
    }
    throw new RangeError(
      'ProgramProvider: no program reigstered for ' +
        programName +
        ' with key: ' +
        key
    );
  }

  initialize(
    programName: string,
    values: Dictionary<string> = emptyValues,
    key = emptyValuesKey
  ) {
    if (this.programs[programName] === undefined) {
      throw new RangeError(
        'ProgramProvider: ' + programName + ' is not registered'
      );
    }

    if (this.programs[programName].programs[key]) {
      throw new Error(
        'ProgramProvider: ' +
          programName +
          ', key: ' +
          key +
          ' already initialized'
      );
    }

    const { config, glsl } = this.programs[programName];
    this.programs[programName].programs[key] = generateAndCreateProgram(
      this.gl,
      config,
      glsl,
      values
    );
  }

  register(programName: string, desc: ProgramCompilerDescription) {
    if (this.programs[programName]) {
      throw new Error(
        'ProgramProvider: ' + programName + ' already registered'
      );
    }
    this.programs[programName] = {
      config: desc,
      glsl: generateProgramGenerators(desc),
      programs: {},
    };
  }
}
