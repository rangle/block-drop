import {
  declareVariable,
  getTemplateLiterals,
  GlTypes,
  declareBindingOrStruct,
  GlBindTypes,
  getBindTypeFromConvention,
  checkRequirement,
  implementFunction,
  GlFragmentFunctionSnippets,
  generateProgramGenerators,
  GlVertexFunctionSnippets,
  getBindings,
} from './program-generator';

describe('program generator', () => {
  describe('generateProgramGenerators', () => {
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

    it('generates the expected fragment', () => {
      expect(
        generateProgramGenerators({
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
              name: 'main',
              returnType: GlTypes.Int,
              snippet: GlVertexFunctionSnippets.Main1,
            },
          ],
        }).fragment()
      ).toBe(`precision mediump float;
varying vec4 v_colour;

int main() {
   gl_FragColor = v_colour;
}`);
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
      expect(declareVariable(GlTypes.Custom, 'foo')).toBe('Foo foo');
    });

    it('throws if struct is given (use Custom instead)', () => {
      expect(() => {
        declareVariable(GlTypes.Struct, 'foo');
      }).toThrowError();
    });
  });

  describe('declareBindingOrStruct', () => {
    it('can handle a simple struct', () => {
      expect(
        declareBindingOrStruct(GlBindTypes.Uniform, GlTypes.Struct, 'foo', [
          {
            bindType: GlBindTypes.Uniform,
            name: 'dummy',
            varType: GlTypes.Int,
          },
        ])
      ).toBe(`struct Foo {
  int dummy;
}`);
    });
    it('can handle a struct with two things', () => {
      expect(
        declareBindingOrStruct(GlBindTypes.Uniform, GlTypes.Struct, 'foo', [
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
        ])
      ).toBe(`struct Foo {
  int dummy;
  float bar;
  vec3 baz;
}`);
    });
  });

  describe('implementFunction', () => {
    it('produces the expected output', () => {});
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
          { literals: {}, snippet: 'body' }
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
                varType: GlTypes.Custom,
              },
            ],
            name: 'foo',
            returnType: GlTypes.Float,
            snippet: GlFragmentFunctionSnippets.Main1,
          },
          { literals: {}, snippet: 'body' }
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
