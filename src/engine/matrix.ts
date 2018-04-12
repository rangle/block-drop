/**
 * Naive matrix functions
 */
import { Matrix } from '../interfaces';

/**
 * Non destructive rotateLeft function
 */
export function rotateLeft(m: Matrix): Matrix {
  if (m.length === 0) {
    return [];
  }
  if (m[0].length === 0) {
    return [];
  }
  const transposed = transpose(m);
  const rotated = [];

  for (let i = 0; i < transposed.length; i += 1) {
    rotated[i] = [];

    for (let j = transposed[0].length - 1; j >= 0; j -= 1) {
      rotated[i].push(transposed[i][j]);
    }
  }

  return rotated;
}

/**
 * Non destructive rotateRight function
 */
export function rotateRight(m: Matrix): Matrix {
  if (m.length === 0) {
    return [];
  }
  if (m[0].length === 0) {
    return [];
  }

  const transposed = transpose(m);
  const rotated = [];

  for (let i = transposed.length - 1; i >= 0; i -= 1) {
    rotated.push(transposed[i].slice(0));
  }

  return rotated;
}

/**
 * Non destructive transpose function
 */
export function transpose(m: Matrix): Matrix {
  if (m.length === 0) {
    return [];
  }
  if (m[0].length === 0) {
    return [];
  }
  const transposed = new Array(m[0].length);

  for (let i = 0; i < m.length; i += 1) {
    for (let j = 0; j < m[0].length; j += 1) {
      if (transposed[j] === undefined) {
        transposed[j] = new Array(m.length);
      }
      transposed[j][i] = m[i][j];
    }
  }

  return transposed;
}
