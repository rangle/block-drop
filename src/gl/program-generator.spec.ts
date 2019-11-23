import {
  declareVariable,
  getTemplateLiterals,
  declareBindingOrStruct,
  getBindTypeFromConvention,
  checkRequirement,
  implementFunction,
  generateProgramGenerators,
  getBindings,
} from './program-generator';
import {
  GlTypes,
  GlFragmentFunctionSnippets,
  GlBindTypes,
  GlVertexFunctionSnippets,
  ProgramCompilerDescription,
} from './interfaces';

export const workingProgramConfigSimple: () => ProgramCompilerDescription = () => ({
  fragmentDeclarations: [
    {
      bindType: GlBindTypes.Varying,
      name: 'v_colour',
      varType: GlTypes.Vec4,
    },
  ],
  fragmentFunctions: [
    {
      declarations: [],
      name: 'main',
      returnType: GlTypes.Void,
      snippet: GlFragmentFunctionSnippets.Main1,
    },
  ],
  vertexDeclarations: [
    {
      bindType: GlBindTypes.Attribute,
      glType: 'FLOAT',
      name: 'a_position',
      varType: GlTypes.Vec4,
      normalize: false,
      offset: 0,
      size: 3,
      stride: 0,
    },
    {
      bindType: GlBindTypes.Attribute,
      glType: 'UNSIGNED_BYTE',
      name: 'a_colour',
      varType: GlTypes.Vec4,
      normalize: true,
      offset: 0,
      size: 3,
      stride: 0,
    },
    {
      bindType: GlBindTypes.Uniform,
      name: 'u_worldViewProjection',
      varType: GlTypes.Mat4,
    },
    {
      bindType: GlBindTypes.Varying,
      name: 'v_colour',
      varType: GlTypes.Vec4,
    },
  ],
  vertexFunctions: [
    {
      declarations: [],
      name: 'main',
      returnType: GlTypes.Void,
      snippet: GlVertexFunctionSnippets.Main1,
    },
  ],
});

export const workingProgramConfigComplex: () => ProgramCompilerDescription = () => ({
  fragmentDeclarations: [
    {
      bindType: GlBindTypes.Varying,
      name: 'v_colour',
      varType: GlTypes.Vec4,
    },
  ],
  fragmentFunctions: [
    {
      declarations: [],
      name: 'main',
      returnType: GlTypes.Void,
      snippet: GlFragmentFunctionSnippets.Main1,
    },
  ],
  vertexDeclarations: [
    {
      bindType: GlBindTypes.Attribute,
      glType: 'FLOAT',
      name: 'a_position',
      varType: GlTypes.Vec4,
      normalize: false,
      offset: 0,
      size: 3,
      stride: 0,
    },
    {
      bindType: GlBindTypes.Attribute,
      glType: 'UNSIGNED_BYTE',
      name: 'a_colour',
      varType: GlTypes.Vec4,
      normalize: true,
      offset: 0,
      size: 3,
      stride: 0,
    },
    {
      bindType: GlBindTypes.Uniform,
      name: 'u_worldViewProjection',
      varType: GlTypes.Mat4,
    },
    {
      bindType: GlBindTypes.Uniform,
      length: 3,
      name: 'u_scalarArray',
      varType: GlTypes.Int,
    },
    {
      bindType: GlBindTypes.Uniform,
      length: [
        {
          bindType: GlBindTypes.Uniform,
          name: 'someProp',
          varType: GlTypes.Vec3,
        },
      ],
      name: 'sampleStruct',
      varType: GlTypes.StructDeclaration,
    },
    {
      bindType: GlBindTypes.Uniform,
      length: 1,
      name: 'u_floatArray',
      varType: GlTypes.Float,
    },
    {
      bindType: GlBindTypes.Uniform,
      name: 'u_sampleStruct',
      varType: GlTypes.Struct,
    },
    {
      bindType: GlBindTypes.Uniform,
      length: 3,
      name: 'u_sampleStruct_sampleStructArray',
      varType: GlTypes.Struct,
    },
    {
      bindType: GlBindTypes.Varying,
      name: 'v_colour',
      varType: GlTypes.Vec4,
    },
  ],
  vertexFunctions: [
    {
      declarations: [],
      name: 'main',
      returnType: GlTypes.Void,
      snippet: GlVertexFunctionSnippets.Main1,
    },
  ],
});

describe('program generator', () => {
  describe('generateProgramGenerators', () => {
    it('generates the expected simple fragment', () => {
      expect(generateProgramGenerators(workingProgramConfigSimple()).fragment())
        .toBe(`precision mediump float;
varying vec4 v_colour;

void main() {
  gl_FragColor = v_colour;
}`);
    });

    it('generates the expected complex vertex', () => {
      expect(
        generateProgramGenerators(workingProgramConfigComplex())
          .vertex()
          .trim()
      ).toBe(`struct SampleStruct {
  vec3 someProp;
};
attribute vec4 a_position;
attribute vec4 a_colour;
uniform mat4 u_worldViewProjection;
uniform int u_scalarArray[3];
uniform float u_floatArray[1];
uniform SampleStruct u_sampleStruct;
uniform SampleStruct u_sampleStructArray[3];
varying vec4 v_colour;

void main() {
  gl_Position = u_worldViewProjection * a_position;
  v_colour = a_colour;
}`);
    });

    it('throws with no fragmentDeclarations', () => {
      expect(() =>
        generateProgramGenerators({
          fragmentDeclarations: [],
          fragmentFunctions: [
            {
              declarations: [],
              name: 'foo',
              returnType: GlTypes.Int,
              snippet: GlFragmentFunctionSnippets.Main1,
            },
          ],
          vertexDeclarations: [
            {
              bindType: GlBindTypes.Attribute,
              name: 'a_position',
              varType: GlTypes.Vec4,
            },
            {
              bindType: GlBindTypes.Attribute,
              name: 'a_colour',
              varType: GlTypes.Vec4,
            },
            {
              bindType: GlBindTypes.Uniform,
              name: 'u_worldViewProjection',
              varType: GlTypes.Mat4,
            },
            {
              bindType: GlBindTypes.Varying,
              name: 'v_colour',
              varType: GlTypes.Vec4,
            },
          ],
          vertexFunctions: [
            {
              declarations: [],
              name: 'foo',
              returnType: GlTypes.Int,
              snippet: GlVertexFunctionSnippets.Main1,
            },
          ],
        })
      ).toThrowError();
    });
  });

  describe('getTemplateLiterals', () => {
    it('does nothing if there are no template strings in the source', () => {
      const source = `hello world`;
      expect(getTemplateLiterals(source)).toEqual({});
    });

    it('throws if missing a closing brace', () => {
      const source = 'hello ${ world';
      expect(() => getTemplateLiterals(source)).toThrowError();
    });

    it('returns a Dictionary of string start/end positions', () => {
      const source = 'hello ${ world } ${foo}';
      expect(getTemplateLiterals(source)).toEqual({
        foo: [{ end: 21, start: 16 }],
        world: [{ end: 15, start: 6 }],
      });
    });
  });

  describe('declareVariable', () => {
    it('uppercases the first name of a Custom (struct) type', () => {
      expect(declareVariable(GlTypes.Struct, 'foo')).toBe('Foo foo');
    });

    it('throws if struct is given (use Custom instead)', () => {
      expect(() => {
        declareVariable(GlTypes.StructDeclaration, 'foo');
      }).toThrowError();
    });
  });

  describe('declareBindingOrStruct', () => {
    it('can handle a simple struct', () => {
      expect(
        declareBindingOrStruct(
          GlBindTypes.Uniform,
          GlTypes.StructDeclaration,
          'foo',
          [
            {
              bindType: GlBindTypes.Uniform,
              name: 'dummy',
              varType: GlTypes.Int,
            },
          ]
        )
      ).toBe(`struct Foo {
  int dummy;
};`);
    });
    it('can handle a struct with two things', () => {
      expect(
        declareBindingOrStruct(
          GlBindTypes.Uniform,
          GlTypes.StructDeclaration,
          'foo',
          [
            {
              bindType: GlBindTypes.Uniform,
              name: 'dummy',
              varType: GlTypes.Int,
            },
            {
              bindType: GlBindTypes.Uniform,
              name: 'bar',
              varType: GlTypes.Float,
            },
            {
              bindType: GlBindTypes.Uniform,
              name: 'baz',
              varType: GlTypes.Vec3,
            },
          ]
        )
      ).toBe(`struct Foo {
  int dummy;
  float bar;
  vec3 baz;
};`);
    });
  });

  describe('implementFunction', () => {
    it('produces the expected simple output', () => {
      expect(
        implementFunction(
          {},
          {
            a_: {},
            u_: {},
            v_: {},
          },
          {
            declarations: [],
            name: 'add',
            returnType: GlTypes.Int,
            snippet: GlVertexFunctionSnippets.Main1,
          },
          {
            literals: {},
            snippet: 'foo',
            sortedLiterals: [],
          }
        )
      ).toBe(`int add() {
  foo
}`);
    });

    it('produces the expected output with one uniform', () => {
      expect(
        implementFunction(
          {},
          {
            a_: {},
            u_: { u_bar: 'u_bar' },
            v_: {},
          },
          {
            declarations: [],
            name: 'add',
            returnType: GlTypes.Int,
            snippet: GlVertexFunctionSnippets.Main1,
          },
          {
            literals: { u_bar: [{ start: 4, end: 11 }] },
            snippet: 'foo ${u_bar}',
            sortedLiterals: [
              { name: 'u_bar', position: { start: 4, end: 11 } },
            ],
          }
        )
      ).toBe(`int add() {
  foo u_bar
}`);
    });

    it('produces the expected output with two uniforms', () => {
      expect(
        implementFunction(
          {},
          {
            a_: {},
            u_: { u_bar: 'u_bar', u_baz: 'u_baz' },
            v_: {},
          },
          {
            declarations: [],
            name: 'add',
            returnType: GlTypes.Int,
            snippet: GlVertexFunctionSnippets.Main1,
          },
          {
            literals: {
              u_bar: [{ start: 4, end: 11 }],
              u_baz: [{ start: 14, end: 21 }],
            },
            snippet: 'foo ${u_bar} * ${u_baz}',
            sortedLiterals: [
              { name: 'u_bar', position: { start: 4, end: 11 } },
              { name: 'u_baz', position: { start: 14, end: 21 } },
            ],
          }
        )
      ).toBe(`int add() {
  foo u_bar * u_baz
}`);
    });
  });

  describe('getBindTypeFromConvention', () => {
    it('returns Attribute if prefixed by a_', () => {
      expect(getBindTypeFromConvention('a_var')).toBe(GlBindTypes.Attribute);
    });

    it('returns Custom if prefixed by c_', () => {
      expect(getBindTypeFromConvention('c_var')).toBe(GlBindTypes.Custom);
    });

    it('throws with no prefix', () => {
      expect(() => getBindTypeFromConvention('var')).toThrowError();
    });
  });

  describe('checkRequirement', () => {
    it('does not throw if literal found in uniform', () => {
      expect(() =>
        checkRequirement('u_foo', [
          {
            bindType: GlBindTypes.Uniform,
            name: 'u_foo',
            varType: GlTypes.Int,
          },
        ])
      ).not.toThrowError();
    });

    it('ignores customs', () => {
      expect(() =>
        checkRequirement('c_foo', [
          {
            bindType: GlBindTypes.Uniform,
            name: '',
            varType: GlTypes.Int,
          },
        ])
      ).not.toThrowError();
    });

    it('throws if not found', () => {
      expect(() =>
        checkRequirement('u_foo', [
          {
            bindType: GlBindTypes.Uniform,
            name: 'bar',
            varType: GlTypes.Int,
          },
        ])
      ).toThrowError();
    });
  });

  describe('implement function', () => {
    it('implements simple functions', () => {
      expect(
        implementFunction(
          {},
          {
            u_: {},
            v_: {},
          },
          {
            declarations: [],
            name: 'foo',
            returnType: GlTypes.Float,
            snippet: GlFragmentFunctionSnippets.Main1,
          },
          { literals: {}, snippet: 'body', sortedLiterals: [] }
        )
      ).toBe(`float foo() {
  body
}`);
    });

    it('replaces custom values', () => {
      expect(
        implementFunction(
          { c_var: 'my custom' },
          { u_: {}, v_: {} },
          {
            declarations: [],
            name: 'foo',
            returnType: GlTypes.Float,
            snippet: GlFragmentFunctionSnippets.Main1,
          },
          {
            literals: { c_var: [{ end: 14, start: 5 }] },
            snippet: 'body ${c_var}',
            sortedLiterals: [
              { name: 'c_var', position: { end: 14, start: 5 } },
            ],
          }
        )
      ).toBe(`float foo() {
  body my custom
}`);
    });

    it('throws if custom values are not present', () => {
      expect(() =>
        implementFunction(
          {},
          { u_: {}, v_: {} },
          {
            declarations: [],
            name: 'foo',
            returnType: GlTypes.Float,
            snippet: GlFragmentFunctionSnippets.Main1,
          },
          {
            literals: { c_var: [{ end: 13, start: 6 }] },
            snippet: 'body ${c_var}',
            sortedLiterals: [
              { name: 'c_var', position: { end: 13, start: 6 } },
            ],
          }
        )
      ).toThrowError();
    });

    it('declares multiple variables', () => {
      expect(
        implementFunction(
          {},
          { u_: {}, v_: {} },
          {
            declarations: [
              {
                name: 'bar',
                varType: GlTypes.Int,
              },
              {
                name: 'pointDir',
                varType: GlTypes.Struct,
              },
            ],
            name: 'foo',
            returnType: GlTypes.Float,
            snippet: GlFragmentFunctionSnippets.Main1,
          },
          { literals: {}, snippet: 'body', sortedLiterals: [] }
        )
      ).toBe(`float foo(int bar, PointDir pointDir) {
  body
}`);
    });
  });

  describe('getBindings', () => {
    it('produces the expected binding dictionary', () => {
      expect(
        getBindings({
          fragmentDeclarations: [
            {
              bindType: GlBindTypes.Uniform,
              name: 'bar',
              varType: GlTypes.Int,
            },
          ],
          fragmentFunctions: [],
          vertexDeclarations: [
            {
              bindType: GlBindTypes.Attribute,
              name: 'foo',
              varType: GlTypes.Int,
            },
          ],
          vertexFunctions: [],
        })
      ).toEqual({
        fragment: {
          u_: { bar: 'bar' },
          v_: {},
        },
        vertex: {
          a_: { foo: 'foo' },
          u_: {},
          v_: {},
        },
      });
    });
  });
});
