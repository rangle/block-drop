import { app, IAppState, routesFilter } from './app.reducer';
import {
  BD_ROUTE_UPDATE,
  CHANGE_FRAMEWORK,
  CHANGE_MULTI_FRAMEWORK,
  ROUTES,
} from '../constants';

describe('app reducer', () => {
  describe('BD_ROUTE_UPDATE', () => {
    it('should re-calculate routes based on payload', () => {
      const state = <IAppState>{};
      const newState = app(state, { type: BD_ROUTE_UPDATE, payload: 5 });
      expect(newState.routes).toEqual(ROUTES);
    });

    it('should return a new object', () => {
      const state = <IAppState>{};
      const newState = app(state, { type: BD_ROUTE_UPDATE, payload: 5 });
      expect(state).not.toBe(newState);
    });
  });

  describe('CHANGE_FRAMEWORK', () => {
    it('should re-calculate currentFramework based on payload', () => {
      const state = <IAppState>{};
      const newState = app(state, { type: CHANGE_FRAMEWORK, payload: 5 });
      expect(newState.currentFramework).toEqual(5);
    });
  });

  describe('CHANGE_MULTI_FRAMEWORK', () => {
    it('should re-calculate useMultiFrameworks based on payload', () => {
      const state = <IAppState>{};
      const newState = app(state, { type: CHANGE_MULTI_FRAMEWORK, payload: 5 });
      expect(newState.useMultiFrameworks).toEqual(5);
    });
  });
});

describe('routesFilter function', () => {
  it('should return false if given a match', () => {
    expect(routesFilter('test', { path: 'test' })).toBe(false);
  });

  it('should return false if given a /match', () => {
    expect(routesFilter('/test', { path: 'test' })).toBe(false);
  });

  it('should return true if given a non-match', () => {
    expect(routesFilter('booga', { path: 'test' })).toBe(true);
  });
});
