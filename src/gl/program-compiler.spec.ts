import { generateAndCreateProgram, UniformBuilder } from './program-compiler';
import { generateProgramGenerators } from './program-generator';
import {
  workingProgramConfigSimple,
  workingProgramConfigComplex,
} from './program-generator.spec';

const mockGl = () =>
  (({
    attachShader: jest.fn(),
    compileShader: jest.fn(),
    createBuffer: jest.fn(() => 'buffer'),
    createProgram: jest.fn(() => 'program'),
    createShader: jest.fn(() => 'shader'),
    deleteProgram: jest.fn(),
    deleteShader: jest.fn(),
    getAttribLocation: jest.fn(() => 'attribure location'),
    getProgramParameter: jest.fn(() => 'program param'),
    getShaderParameter: jest.fn(() => 'shader param'),
    getUniformLocation: jest.fn(() => 'uniform location'),
    linkProgram: jest.fn(),
    shaderSource: jest.fn(),
    FLOAT: 'float',
    UNSIGNED_BYTE: 'unsigned byte',
  } as any) as WebGLRenderingContext);

describe('program compiler', () => {
  describe('createProgramCompiler', () => {
    it('compiles a simple program', () => {
      const config = workingProgramConfigSimple();
      const gl = mockGl();
      const glsl = generateProgramGenerators(config);
      expect(() =>
        generateAndCreateProgram(gl, config, glsl)
      ).not.toThrowError();
    });
  });

  describe('uniform builder', () => {
    let builder: UniformBuilder;

    describe('simple case', () => {
      beforeEach(() => {
        builder = UniformBuilder.create(
          mockGl(),
          ('program' as any) as WebGLProgram,
          workingProgramConfigSimple()
        );
      });

      it('creates a uniform attribute dictionary', () => {
        const dict = builder.build();
        expect(typeof dict.u_worldViewProjection === 'function').toBe(true);
      });
    });

    describe('complex case', () => {
      beforeEach(() => {
        builder = UniformBuilder.create(
          mockGl(),
          ('program' as any) as WebGLProgram,
          workingProgramConfigComplex()
        );
      });

      it('creates a uniform attribute dictionary', () => {
        const dict = builder.build();
        expect(typeof dict['u_sampleStruct.someProp'] === 'function').toBe(
          true
        );
      });

      it('creates a uniform attribute dictionary', () => {
        const dict = builder.build();
        expect(
          typeof dict['u_sampleStructArray[1].someProp'] === 'function'
        ).toBe(true);
      });
    });
  });
});
