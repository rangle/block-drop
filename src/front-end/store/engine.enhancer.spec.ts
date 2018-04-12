import { blockDropEngine, createGame } from './engine.enhancer';
import { noop } from '../../util';

describe("Engine's Redux Enhancer", () => {
  let store: any;

  beforeEach(() => {
    store = {
      dispatch: () => null,
      getState: () => ({
        nextConfig: {},
      }),
    };
  });

  describe('createGame function', () => {
    it('should set a new engine reference', () => {
      const ref = {};
      createGame(ref, store);
      expect((<any>ref).engine).toBeTruthy();
    });
  });

  describe('blockDropEngine function', () => {
    it('should return a function', () => {
      const result = blockDropEngine({}, noop as any);
      expect(typeof result).toBe('function');
    });

    it('the returned function should return a new "store"', () => {
      const enhancer = blockDropEngine({}, () => store);
      const result = enhancer(noop as any);
      expect(typeof result).toBe('object');
    });
  });
});
