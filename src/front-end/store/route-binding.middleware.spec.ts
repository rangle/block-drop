import { routeBindingMiddleware } from './route-binding.middleware';
import { noop } from '../../util';

describe('route binding middleware', () => {
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
      const next = (arg) => {
        expect(arg).toBe(action);
        called = true;
      };
      mw(next)(action);
      expect(called).toBe(true);
    });

    it('should dispatch if the action is ng2-redux-router::UPDATE_LOCATION',
      () => {
        let dispatchedAlso;
        store.dispatch = (a) => dispatchedAlso = a;
        const action = { type: 'ng2-redux-router::UPDATE_LOCATION' };
        const mw = routeBindingMiddleware(store);
        mw(noop)(action);
        expect(dispatchedAlso).toBeTruthy();
    });

    it('should call next if the action is ng2-redux-router::UPDATE_LOCATION',
      () => {
        const action = { type: 'ng2-redux-router::UPDATE_LOCATION' };
        let called = false;
        const mw = routeBindingMiddleware(store);
        const next = (arg) => {
          expect(arg).toBe(action);
          called = true;
        };
        mw(next)(action);
        expect(called).toBe(true);
      });
  });
});
