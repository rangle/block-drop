import { createObjectPool } from './object-pool';

describe('Object Pool', () => {
  it('returns instances of a given thing', () => {
    const op = createObjectPool(() => new Array(0));
    expect(Array.isArray(op.malloc())).toBe(true);
  });

  it('returns cached instances of things', () => {
    const op = createObjectPool(() => [1]);
    const thing = op.malloc();
    op.free(thing);
    const original = op.malloc();
    expect(original).toBe(thing);
  });

  it('creates new instances of things (assuming the given create does that)', () => {
    const op = createObjectPool(() => [1]);
    const thing1 = op.malloc();
    const thing2 = op.malloc();
    expect(thing1).not.toBe(thing2);
  });
});
