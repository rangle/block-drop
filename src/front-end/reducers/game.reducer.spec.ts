import { game, IGameState } from './game.reducer';
import {
  EVENT_KEYPRESS,
  EVENT_RESIZE,
  REPLACE_CONFIG,
  UPDATE_ACTIVE_PIECE,
  UPDATE_BUFFER,
  UPDATE_PREVIEW,
} from '../constants';

describe('game reducer', () => {
  /**
   * Generally this type of testing is considered bad :(
   * This is basically a smoke test
   */
  const actions = {};

  actions[EVENT_KEYPRESS] = 'lastEvent';
  actions[EVENT_RESIZE] = 'currentGameViewportDimensions';
  actions[REPLACE_CONFIG] = 'config';
  actions[UPDATE_ACTIVE_PIECE] = 'activePiece';
  actions[UPDATE_BUFFER] = 'buffer';
  actions[UPDATE_PREVIEW] = 'preview';

  Object.keys(actions).forEach(action => {
    describe(action, () => {
      testSimpleNewMerge(action, actions[action]);
    });
  });
});

function testSimpleNewMerge(actionType: string, prop: string) {
  it('should re-calculate currentFramework based on payload', () => {
    const state = <IGameState>{};
    const newState = game(state, { type: actionType, payload: 5 });
    expect(newState[prop]).toEqual(5);
  });

  it('should return a new object', () => {
    const state = <IGameState>{};
    const newState = game(state, { type: actionType, payload: 5 });
    expect(state).not.toBe(newState);
  });
}
