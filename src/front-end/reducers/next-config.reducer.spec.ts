import { nextConfig } from './next-config.reducer';
import { CHANGE_NEXT_CONFIG, REPLACE_NEXT_CONFIG } from '../constants';

describe('next config reducer', () => {
  describe('CHANGE_NEXT_CONFIG', () => {
    it('should assign a new payload to state[meta]', () => {
      const state: any = { test: 5 };
      const newState = nextConfig(state, {
        type: CHANGE_NEXT_CONFIG,
        payload: 7,
        meta: 'test',
      });

      expect(newState.test).toBe(7);
    });

    it('should return a new object', () => {
      const state: any = { test: 5 };
      const newState = nextConfig(state, {
        type: CHANGE_NEXT_CONFIG,
        payload: 7,
        meta: 'test',
      });

      expect(newState).not.toBe(state);
    });
  });

  describe('REPLACE_NEXT_CONFIG', () => {
    it('should replace state with payload', () => {
      const state = {};
      const newState = nextConfig(state, {
        type: REPLACE_NEXT_CONFIG,
        payload: {
          hello: 'world',
        },
        meta: null,
      });
      expect(newState.hello).toBe('world');
    });

    it('should return a new object', () => {
      const state = {};
      const newState = nextConfig(state, {
        type: REPLACE_NEXT_CONFIG,
        payload: {
          hello: 'world',
        },
        meta: null,
      });
      expect(newState).not.toBe(state);
    });
  });
});
