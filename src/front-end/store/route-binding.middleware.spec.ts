import { routeBindingMiddleware } from './route-binding.middleware';
import { noop } from '../../util';
import { THIRD_PARTY_TYPES } from '../reducers/route-binding.reducer';

describe('route binding middleware', () => {
  const actionType = THIRD_PARTY_TYPES[1];
  describe('routeBindingMiddleware function', () => {
    let store;

    beforeEach(() => {
      store = {
        dispatch: noop,
      };
    });

    it('should return a reducer that does nothing on an "unknonw" type', () => {
      const action = { type: 'gibberish blah' };
      let called = false;
      const mw = routeBindingMiddleware(store);
      const next = arg => {
        expect(arg).toBe(action);
        called = true;
      };
      mw(next)(action);
      expect(called).toBe(true);
    });

    it('should dispatch if the action is ' + actionType, () => {
      let dispatchedAlso;
      store.dispatch = a => (dispatchedAlso = a);
      const action = { type: actionType };
      const mw = routeBindingMiddleware(store);
      mw(noop)(action);
      expect(dispatchedAlso).toBeTruthy();
    });

    it('should call next if the action is ng2-redux-router::UPDATE_LOCATION', () => {
      const action = { type: actionType };
      let called = false;
      const mw = routeBindingMiddleware(store);
      const next = arg => {
        expect(arg).toBe(action);
        called = true;
      };
      mw(next)(action);
      expect(called).toBe(true);
    });
  });
});
