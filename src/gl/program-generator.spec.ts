import {
  declareVariable,
  getTemplateLiterals,
  GlTypes,
  declareBindingOrStruct,
  GlBindTypes,
} from './program-generator';

describe('program generator', () => {
  describe('createProgram', () => {});

  describe('getTemplateLiterals', () => {
    it('does nothing if there are no template strings in the source', () => {
      const source = `hello world`;
      expect(getTemplateLiterals(source)).toEqual([]);
    });

    it('throws if missing a closing brace', () => {
      const source = 'hello ${ world';
      expect(() => getTemplateLiterals(source)).toThrowError();
    });

    it('returns a list of string literals', () => {
      /** @note this test could fail b/c object literal order is not guaranteed */
      const source = 'hello ${ world } ${foo}';
      expect(getTemplateLiterals(source)).toEqual(['world', 'foo']);
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
});
