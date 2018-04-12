import { gameOver1, tick1 } from './rules';
import { noop } from '../util';

describe('rules functions', () => {
  describe('gameOver1 function', () => {
    it("calls engine's game over method", () => {
      let wasCalled = false;
      gameOver1({
        gameOver: () => (wasCalled = true),
      });
      expect(wasCalled).toBe(true);
    });
  });

  describe('tick1 function', () => {
    let state: any;

    beforeEach(() => {
      state = {
        buffer: new Uint8Array([]),
        level: 1,
        conf: {
          canMoveDown: () => true,
          checkForLoss: () => false,
          speedMultiplier: 1,
          speed: 1000,
        },
        isEnded: false,
      };
    });
    it('returns undefined if the game is ended', () => {
      state.isEnded = true;
      expect(tick1({ state } as any, 0)).toBe(undefined);
    });

    it('returns false if delta is less than the interval', () => {
      expect(
        tick1(
          {
            state,
          } as any,
          500,
        ),
      ).toBe(false);
    });
    it('moves the block down if possible', () => {
      let didRun = false;
      tick1(
        {
          emit: noop,
          state,
          moveBlock: () => (didRun = true),
        } as any,
        10000,
      );
      expect(didRun).toBe(true);
    });

    it('ends the game if it cannot move down and checkForLoss returns true', () => {
      let didRun = false;
      state.conf.canMoveDown = () => false;
      state.conf.checkForLoss = () => true;
      tick1(
        {
          addBlock: noop,
          board: {
            desc: new Uint8Array([]),
          },
          clearCheck: noop,
          emit: noop,
          gameOver: () => (didRun = true),
          newBlock: noop,
          state,
          moveBlock: noop,
        } as any,
        10000,
      );
      expect(didRun).toBe(true);
    });

    it(
      'continues the game if it cannot move down and checkForLoss returns ' +
        'false',
      () => {
        let didRun = false;
        state.conf.canMoveDown = () => false;
        state.conf.checkForLoss = () => false;
        tick1(
          {
            addBlock: noop,
            board: {
              desc: new Uint8Array([]),
            },
            clearCheck: noop,
            emit: noop,
            gameOver: () => (didRun = true),
            newBlock: noop,
            state,
            moveBlock: noop,
          } as any,
          10000,
        );
        expect(didRun).toBe(false);
      },
    );
  });
});
