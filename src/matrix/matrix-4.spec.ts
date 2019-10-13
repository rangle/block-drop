import { identity4_4, multiply4_4 } from './matrix-4';

describe('3d-space matrix operations', () => {
  describe('identity4_4', () => {
    it('returns a matrix that is the matrix equivalent of the number 1', () => {
      const id1 = identity4_4();
      const id2 = identity4_4();
      const result = multiply4_4(id1, id2);

      expect(result).toEqual(id1);
      expect(result).toEqual(id2);
    });
  });
});
