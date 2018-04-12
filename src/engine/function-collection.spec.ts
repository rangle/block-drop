import { registerTo, getFunctionFrom } from './function-collection';

import { noop } from '../util';

describe('function collection functions', () => {
  describe('getFunctionFrom', () => {
    it('should return a function if it exists on collection', () => {
      const collection = { test: noop };
      expect(getFunctionFrom(noop, collection, 'test')).toBe(noop);
    });

    it(
      'should return the default random function if requested function does ' +
        'not exist',
      () => {
        const defaultFn = noop;
        expect(getFunctionFrom(defaultFn, {})).toBe(defaultFn);
      },
    );
  });

  describe('registerTo function', () => {
    it('should throw if not given a function', () => {
      expect(() => registerTo({}, 'test', <() => number>{})).toThrowError();
    });

    it('should throw if not given a truthy prop', () => {
      expect(() => registerTo({}, '', <() => number>noop)).toThrowError();
    });

    it('should throw if prop is not a string', () => {
      expect(() =>
        registerTo({}, <string>{}, <() => number>noop),
      ).toThrowError();
    });

    it(
      'should not add the function to the collection if a truthy prop ' +
        'already exists',
      () => {
        const collection = { test: 'taken' };
        registerTo(collection, 'test', <() => number>noop);
        expect(collection.test).toBe('taken');
      },
    );

    it('should add a function to a collection', () => {
      const collection = { test: false };
      registerTo(collection, 'test', <() => number>noop);
      expect(collection.test).toBe(noop as any);
    });
  });
});
