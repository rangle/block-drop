import { Store } from 'redux';
import { blockDropEngine, createGame } from './engine.enhancer';
import { IState } from './store';
import { noop } from '../../util';

describe('Engine\'s Redux Enhancer', () => {
  let store;

  beforeEach(() => {
    store = <Store<IState>>{
      dispatch: () => null,
      getState: () => ({
        nextConfig: {

        },
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
      const result = blockDropEngine({}, noop);
      expect(typeof result).toBe('function');
    });

    it('the returned function should return a new "store"', () => {
      const enhancer = blockDropEngine({}, () => store);
      const result = enhancer(noop);
      expect(typeof result).toBe('object');
    });
  });
});
