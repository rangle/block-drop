import { ObjectPool } from '../interfaces';

export function createObjectPool<T>(
  create: () => T,
  initialSize: number = 0
): ObjectPool<T> {
  const pool: T[] = [];

  if (initialSize) {
    for (let i = 0; i < initialSize; i += 1) {
      pool.push(create());
    }
  }

  return {
    free(obj: T) {
      pool.push(obj);
    },
    malloc() {
      if (pool.length) {
        const o = pool.pop();
        if (o) {
          return o;
        }
        return create();
      }
      return create();
    },
  };
}
