import {
  newState_LOCATION_CHANGE,
  newState_UPDATE_LOCATION,
  routeBindingOn,
} from './route-binding.reducer';
import { noop } from '../../util';

describe('routeBinding reducer', () => {
  it(
    'should given reducerA return a reducerB that returns the result of ' +
      'reducerA',
    () => {
      const reducerA = () => 5;
      const reducerB = routeBindingOn({}, reducerA);
      expect(reducerB({}, {})).toBe(5);
    },
  );

  it('should ignore actions not in given RouterActions', () => {
    const reducerA = () => 5;
    const reducerB = routeBindingOn(
      {
        testAction: {
          newState: noop,
          fromPayload: noop,
        } as any,
      },
      reducerA,
    );
    expect(
      reducerB(
        {},
        {
          type: 'something else',
        },
      ),
    ).toBe(5);
  });

  it(
    'should given a matching action compute a new state using the ' +
      "action's payload and the routerActions' fromPayload and every _other_ " +
      "action's newState methods",
    () => {
      const reducerA = state => state;
      const reducerB = routeBindingOn(
        {
          testAction: {
            newState: noop,
            fromPayload: payload => payload.pValue,
          },
          otherAction1: {
            newState: (path, state) =>
              Object.assign({}, state, { sValue: state.sValue + ' ' + path }),
            fromPayload: noop,
          },
          otherAction2: {
            newState: (path, state) =>
              Object.assign({}, state, { other: path + ' ' + state.sValue }),
            fromPayload: noop,
          },
        } as any,
        reducerA,
      );

      const newState = reducerB(
        {
          sValue: 'hello',
          other: null,
        },
        {
          type: 'testAction',
          payload: { pValue: 'world' },
        },
      );

      expect(newState.sValue).toBe('hello world');
      expect(
        newState.other === 'world hello' ||
          newState.other === 'world hello world',
      ).toBe(true);
    },
  );

  describe('newState_LOCATION_CHANGE', () => {
    it('should update the pathname of a given react.locationBeforeTransitions', () => {
      const state = {
        react: {
          locationBeforeTransitions: {
            pathname: 12,
          },
        },
      };
      const newState = newState_LOCATION_CHANGE(15, state);
      expect(newState.react.locationBeforeTransitions.pathname).toBe(15);
    });

    it('should return a new object', () => {
      const original = { pathname: 12 };
      const state = { react: { locationBeforeTransitions: original } };
      const newState = newState_LOCATION_CHANGE(15, state);
      expect(newState.react.locationBeforeTransitions).not.toBe(original);
    });

    it(
      'should create a locationsBeforeTransitions sub object if it does ' +
        'not already exist on state',
      () => {
        const state = { react: {} };
        const newState = newState_LOCATION_CHANGE(15, state);
        expect(newState.react.locationBeforeTransitions.pathname).toBe(15);
      },
    );
  });

  describe('newState_UPDATE_LOCATION', () => {
    it("should override given state's angular prop", () => {
      const state = { angular: 12 };
      const newState = newState_UPDATE_LOCATION(15, state);
      expect(newState.angular).toBe(15);
    });

    it('should return a new object', () => {
      const state = { angular: 12 };
      const newState = newState_UPDATE_LOCATION(15, state);
      expect(state).not.toBe(newState);
    });
  });
});
