import { Matrix3_1, Matrix3_3 } from '../interfaces';

export function identity3_3(): Matrix3_3 {
  return [1, 0, 0, 0, 1, 0, 0, 0, 1];
}

export function multiply3_1(
  a: Matrix3_1,
  b: Matrix3_1,
  v = new Array(3) as Matrix3_1
) {
  v[0] = a[1] * b[2] - a[2] * b[1];
  v[1] = a[2] * b[0] - a[0] * b[2];
  v[2] = a[0] * b[1] - a[1] * b[0];
  return v;
}

export function multiply3_3(a: Matrix3_3, b: Matrix3_3): Matrix3_3 {
  const a00 = a[0 * 3 + 0];
  const a01 = a[0 * 3 + 1];
  const a02 = a[0 * 3 + 2];
  const a10 = a[1 * 3 + 0];
  const a11 = a[1 * 3 + 1];
  const a12 = a[1 * 3 + 2];
  const a20 = a[2 * 3 + 0];
  const a21 = a[2 * 3 + 1];
  const a22 = a[2 * 3 + 2];
  const b00 = b[0 * 3 + 0];
  const b01 = b[0 * 3 + 1];
  const b02 = b[0 * 3 + 2];
  const b10 = b[1 * 3 + 0];
  const b11 = b[1 * 3 + 1];
  const b12 = b[1 * 3 + 2];
  const b20 = b[2 * 3 + 0];
  const b21 = b[2 * 3 + 1];
  const b22 = b[2 * 3 + 2];

  return [
    b00 * a00 + b01 * a10 + b02 * a20,
    b00 * a01 + b01 * a11 + b02 * a21,
    b00 * a02 + b01 * a12 + b02 * a22,
    b10 * a00 + b11 * a10 + b12 * a20,
    b10 * a01 + b11 * a11 + b12 * a21,
    b10 * a02 + b11 * a12 + b12 * a22,
    b20 * a00 + b21 * a10 + b22 * a20,
    b20 * a01 + b21 * a11 + b22 * a21,
    b20 * a02 + b21 * a12 + b22 * a22,
  ];
}

export function subtract3_1(
  a: Matrix3_1,
  b: Matrix3_1,
  v = new Array(3) as Matrix3_1
): Matrix3_1 {
  v[0] = a[0] - b[0];
  v[1] = a[1] - b[1];
  v[2] = a[2] - b[2];
  return v;
}

export function normalize3_1(
  m: Matrix3_1,
  v = new Array(3) as Matrix3_1
): Matrix3_1 {
  const length = Math.sqrt(m[0] * m[0] + m[1] * m[1] + m[2] * m[2]);
  // make sure we don't divide by 0.
  if (length > 0.00001) {
    v[0] = m[0] / length;
    v[1] = m[1] / length;
    v[2] = m[2] / length;

    return v;
  }

  v[0] = 0;
  v[1] = 0;
  v[2] = 0;
  return v;
}

export function createTranslation3_3(tx: number, ty: number): Matrix3_3 {
  return [1, 0, 0, 0, 1, 0, tx, ty, 1];
}

export function createRotation3_3(angleInRadians: number): Matrix3_3 {
  const c = Math.cos(angleInRadians);
  const s = Math.sin(angleInRadians);
  return [c, -s, 0, s, c, 0, 0, 0, 1];
}

export function createScaling3_3(sx: number, sy: number): Matrix3_3 {
  return [sx, 0, 0, 0, sy, 0, 0, 0, 1];
}

export function createProjection3_3(width: number, height: number): Matrix3_3 {
  // Note: This matrix flips the Y axis so that 0 is at the top.
  return [2 / width, 0, 0, 0, -2 / height, 0, -1, 1, 1];
}

export function translate3_3(m: Matrix3_3, x: number, y: number): Matrix3_3 {
  return multiply3_3(createTranslation3_3(x, y), m);
}

export function rotate3_3(m: Matrix3_3, angleInRadians: number): Matrix3_3 {
  return multiply3_3(createRotation3_3(angleInRadians), m);
}

export function scale3_3(m: Matrix3_3, sx: number, sy: number): Matrix3_3 {
  return multiply3_3(createScaling3_3(sx, sy), m);
}

export function project3_3(
  m: Matrix3_3,
  width: number,
  height: number
): Matrix3_3 {
  return multiply3_3(createProjection3_3(width, height), m);
}
