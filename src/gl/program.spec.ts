import { parseShader } from './program';

describe('gl program', () => {
  describe('parseShader', () => {
    it('does nothing if there are no template strings in the source', () => {
      const source = `hello world`;
      expect(parseShader({ foo: 5 }, source)).toBe(source);
    });

    it('throws if missing a closing brace', () => {
      const source = 'hello ${ world';
      expect(() => parseShader({ foo: 5 }, source)).toThrowError();
    });

    it('thows if missing property', () => {
      const source = 'hello ${world}';
      expect(() => parseShader({ foo: 5 }, source)).toThrowError();
    });

    it('substitues single properties', () => {
      const source = 'hello ${world}';
      const expected = `hello 5`;
      expect(parseShader({ world: 5 }, source)).toBe(expected);
    });

    it('substitues multiple properties', () => {
      const source = 'hello ${world} ${world}';
      const expected = `hello 5 5`;
      expect(parseShader({ world: 5 }, source)).toBe(expected);
    });

    it('allows zeros', () => {
      const source = 'hello ${world} ${world}';
      const expected = `hello 0 0`;
      expect(parseShader({ world: 0 }, source)).toBe(expected);
    });
  });
});
