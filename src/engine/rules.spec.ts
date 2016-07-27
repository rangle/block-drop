import {
  gameOver1,
} from './rules';

describe('rules functions', () => {
  describe('gameOver1 function', () => {
    it('calls engine\'s game over method', () => {
      let wasCalled = false;
      gameOver1({ 
        gameOver: () => wasCalled = true,
      });
      expect(wasCalled).toBe(true);
    });
  });
  describe('spawn1 function', () => {
    
  });
});
