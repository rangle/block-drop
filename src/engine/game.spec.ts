import { createGame1 } from './game';
import { createBoard1 } from './board';
import { noop } from '../util';

describe('game functions', () => {
  describe('createGame1', () => {
    it('should return an object', () => {
      expect(
        createGame1(
          {} as any,
          noop,
          createBoard1(1, 1),
          noop,
          noop,
          noop,
          () => 10,
        ),
      ).toBeTruthy();
    });
  });
});
