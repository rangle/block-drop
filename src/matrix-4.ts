import { multiply3_1, normalize3_1, subtract3_1 } from './matrix-3';
import { Matrix3_1, Matrix4_4 } from './interfaces';

export function copy4_4(
  source: Matrix4_4,
  v: Matrix4_4 = new Float32Array(16)
): Matrix4_4 {
  for (let i = 0; i < source.length; i += 1) {
    v[i] = source[i];
  }

  return v;
}

export function identity4_4(v: Matrix4_4 = new Float32Array(16)): Matrix4_4 {
  v[0] = 1;
  v[1] = 0;
  v[2] = 0;
  v[3] = 0;
  v[4] = 0;
  v[5] = 1;
  v[6] = 0;
  v[7] = 0;
  v[8] = 0;
  v[9] = 0;
  v[10] = 1;
  v[11] = 0;
  v[12] = 0;
  v[13] = 0;
  v[14] = 0;
  v[15] = 1;

  return v;
}

export function multiply4_4(
  a: Matrix4_4,
  b: Matrix4_4,
  v: Matrix4_4 = new Float32Array(16)
): Matrix4_4 {
  v[0] = b[0] * a[0] + b[1] * a[4] + b[2] * a[8] + b[3] * a[12];
  v[1] = b[0] * a[1] + b[1] * a[5] + b[2] * a[9] + b[3] * a[13];
  v[2] = b[0] * a[2] + b[1] * a[6] + b[2] * a[10] + b[3] * a[14];
  v[3] = b[0] * a[3] + b[1] * a[7] + b[2] * a[11] + b[3] * a[15];
  v[4] = b[4] * a[0] + b[5] * a[4] + b[6] * a[8] + b[7] * a[12];
  v[5] = b[4] * a[1] + b[5] * a[5] + b[6] * a[9] + b[7] * a[13];
  v[6] = b[4] * a[2] + b[5] * a[6] + b[6] * a[10] + b[7] * a[14];
  v[7] = b[4] * a[3] + b[5] * a[7] + b[6] * a[11] + b[7] * a[15];
  v[8] = b[8] * a[0] + b[9] * a[4] + b[10] * a[8] + b[11] * a[12];
  v[9] = b[8] * a[1] + b[9] * a[5] + b[10] * a[9] + b[11] * a[13];
  v[10] = b[8] * a[2] + b[9] * a[6] + b[10] * a[10] + b[11] * a[14];
  v[11] = b[8] * a[3] + b[9] * a[7] + b[10] * a[11] + b[11] * a[15];
  v[12] = b[12] * a[0] + b[13] * a[4] + b[14] * a[8] + b[15] * a[12];
  v[13] = b[12] * a[1] + b[13] * a[5] + b[14] * a[9] + b[15] * a[13];
  v[14] = b[12] * a[2] + b[13] * a[6] + b[14] * a[10] + b[15] * a[14];
  v[15] = b[12] * a[3] + b[13] * a[7] + b[14] * a[11] + b[15] * a[15];

  return v;
}

export function createTranslation4_4(
  x: number,
  y: number,
  z: number,
  v: Matrix4_4 = new Float32Array(16)
): Matrix4_4 {
  v[0] = 1;
  v[1] = 0;
  v[2] = 0;
  v[3] = 0;
  v[4] = 0;
  v[5] = 1;
  v[6] = 0;
  v[7] = 0;
  v[8] = 0;
  v[9] = 0;
  v[10] = 1;
  v[11] = 0;
  v[12] = x;
  v[13] = y;
  v[14] = z;
  v[15] = 1;

  return v;
}

export function createXRotation4_4(
  angleInRadians: number,
  v: Matrix4_4 = new Float32Array(16)
): Matrix4_4 {
  const c = Math.cos(angleInRadians);
  const s = Math.sin(angleInRadians);

  v[0] = 1;
  v[1] = 0;
  v[2] = 0;
  v[3] = 0;
  v[4] = 0;
  v[5] = c;
  v[6] = s;
  v[7] = 0;
  v[8] = 0;
  v[9] = -s;
  v[10] = c;
  v[11] = 0;
  v[12] = 0;
  v[13] = 0;
  v[14] = 0;
  v[15] = 1;

  return v;
}

export function createYRotation4_4(
  angleInRadians: number,
  v: Matrix4_4 = new Float32Array(16)
): Matrix4_4 {
  const c = Math.cos(angleInRadians);
  const s = Math.sin(angleInRadians);

  v[0] = c;
  v[1] = 0;
  v[2] = -s;
  v[3] = 0;
  v[4] = 0;
  v[5] = 1;
  v[6] = 0;
  v[7] = 0;
  v[8] = s;
  v[9] = 0;
  v[10] = c;
  v[11] = 0;
  v[12] = 0;
  v[13] = 0;
  v[14] = 0;
  v[15] = 1;

  return v;
}

export function createZRotation4_4(
  angleInRadians: number,
  v: Matrix4_4 = new Float32Array(16)
): Matrix4_4 {
  const c = Math.cos(angleInRadians);
  const s = Math.sin(angleInRadians);

  v[0] = c;
  v[1] = s;
  v[2] = 0;
  v[3] = 0;
  v[4] = -s;
  v[5] = c;
  v[6] = 0;
  v[7] = 0;
  v[8] = 0;
  v[9] = 0;
  v[10] = 1;
  v[11] = 0;
  v[12] = 0;
  v[13] = 0;
  v[14] = 0;
  v[15] = 1;

  return v;
}

export function createScaling4_4(
  x: number,
  y: number,
  z: number,
  v: Matrix4_4 = new Float32Array(16)
): Matrix4_4 {
  v[0] = x;
  v[1] = 0;
  v[2] = 0;
  v[3] = 0;
  v[4] = 0;
  v[5] = y;
  v[6] = 0;
  v[7] = 0;
  v[8] = 0;
  v[9] = 0;
  v[10] = z;
  v[11] = 0;
  v[12] = 0;
  v[13] = 0;
  v[14] = 0;
  v[15] = 1;

  return v;
}

export function translate4_4(
  m: Matrix4_4,
  x: number,
  y: number,
  z: number,
  v: Matrix4_4 = new Float32Array(16),
  tv: Matrix4_4 = new Float32Array(16)
): Matrix4_4 {
  return multiply4_4(m, createTranslation4_4(x, y, z, tv), v);
}

export function xRotate4_4(
  m: Matrix4_4,
  angleInRadians: number,
  v: Matrix4_4 = new Float32Array(16),
  tv: Matrix4_4 = new Float32Array(16)
): Matrix4_4 {
  return multiply4_4(m, createXRotation4_4(angleInRadians, tv), v);
}

export function yRotate4_4(
  m: Matrix4_4,
  angleInRadians: number,
  v: Matrix4_4 = new Float32Array(16),
  tv: Matrix4_4 = new Float32Array(16)
): Matrix4_4 {
  return multiply4_4(m, createYRotation4_4(angleInRadians, tv), v);
}

export function zRotate4_4(
  m: Matrix4_4,
  angleInRadians: number,
  v: Matrix4_4 = new Float32Array(16),
  tv: Matrix4_4 = new Float32Array(16)
): Matrix4_4 {
  return multiply4_4(m, createZRotation4_4(angleInRadians, tv), v);
}

export function scale4_4(
  m: Matrix4_4,
  x: number,
  y: number,
  z: number,
  v: Matrix4_4 = new Float32Array(16),
  tv: Matrix4_4 = new Float32Array(16)
): Matrix4_4 {
  return multiply4_4(m, createScaling4_4(x, y, z, tv), v);
}

export function ortho4_4(
  left: number,
  right: number,
  bottom: number,
  top: number,
  near: number,
  far: number,
  v: Matrix4_4 = new Float32Array(16)
): Matrix4_4 {
  v[0] = 2 / (right - left);
  v[1] = 0;
  v[2] = 0;
  v[3] = 0;
  v[4] = 0;
  v[5] = 2 / (top - bottom);
  v[6] = 0;
  v[7] = 0;
  v[8] = 0;
  v[9] = 0;
  v[10] = 2 / (near - far);
  v[11] = 0;
  v[12] = (left + right) / (left - right);
  v[13] = (bottom + top) / (bottom - top);
  v[14] = (near + far) / (near - far);
  v[15] = 1;

  return v;
}

export function perspective4_4(
  fovRadians: number,
  aspect: number,
  near: number,
  far: number,
  v: Matrix4_4 = new Float32Array(16)
) {
  const f = Math.tan(Math.PI * 0.5 - 0.5 * fovRadians);
  const rangeInv = 1.0 / (near - far);

  v[0] = f / aspect;
  v[1] = 0;
  v[2] = 0;
  v[3] = 0;
  v[4] = 0;
  v[5] = f;
  v[6] = 0;
  v[7] = 0;
  v[8] = 0;
  v[9] = 0;
  v[10] = (near + far) * rangeInv;
  v[11] = -1;
  v[12] = 0;
  v[13] = 0;
  v[14] = near * far * rangeInv * 2;
  v[15] = 0;

  return v;
}

export function inverse4_4(
  m: Matrix4_4,
  v: Matrix4_4 = new Float32Array(16)
): Matrix4_4 {
  const m00 = m[0 * 4 + 0];
  const m01 = m[0 * 4 + 1];
  const m02 = m[0 * 4 + 2];
  const m03 = m[0 * 4 + 3];
  const m10 = m[1 * 4 + 0];
  const m11 = m[1 * 4 + 1];
  const m12 = m[1 * 4 + 2];
  const m13 = m[1 * 4 + 3];
  const m20 = m[2 * 4 + 0];
  const m21 = m[2 * 4 + 1];
  const m22 = m[2 * 4 + 2];
  const m23 = m[2 * 4 + 3];
  const m30 = m[3 * 4 + 0];
  const m31 = m[3 * 4 + 1];
  const m32 = m[3 * 4 + 2];
  const m33 = m[3 * 4 + 3];
  const tmp_0 = m22 * m33;
  const tmp_1 = m32 * m23;
  const tmp_2 = m12 * m33;
  const tmp_3 = m32 * m13;
  const tmp_4 = m12 * m23;
  const tmp_5 = m22 * m13;
  const tmp_6 = m02 * m33;
  const tmp_7 = m32 * m03;
  const tmp_8 = m02 * m23;
  const tmp_9 = m22 * m03;
  const tmp_10 = m02 * m13;
  const tmp_11 = m12 * m03;
  const tmp_12 = m20 * m31;
  const tmp_13 = m30 * m21;
  const tmp_14 = m10 * m31;
  const tmp_15 = m30 * m11;
  const tmp_16 = m10 * m21;
  const tmp_17 = m20 * m11;
  const tmp_18 = m00 * m31;
  const tmp_19 = m30 * m01;
  const tmp_20 = m00 * m21;
  const tmp_21 = m20 * m01;
  const tmp_22 = m00 * m11;
  const tmp_23 = m10 * m01;

  const t0 =
    tmp_0 * m11 +
    tmp_3 * m21 +
    tmp_4 * m31 -
    (tmp_1 * m11 + tmp_2 * m21 + tmp_5 * m31);
  const t1 =
    tmp_1 * m01 +
    tmp_6 * m21 +
    tmp_9 * m31 -
    (tmp_0 * m01 + tmp_7 * m21 + tmp_8 * m31);
  const t2 =
    tmp_2 * m01 +
    tmp_7 * m11 +
    tmp_10 * m31 -
    (tmp_3 * m01 + tmp_6 * m11 + tmp_11 * m31);
  const t3 =
    tmp_5 * m01 +
    tmp_8 * m11 +
    tmp_11 * m21 -
    (tmp_4 * m01 + tmp_9 * m11 + tmp_10 * m21);

  const det = m00 * t0 + m10 * t1 + m20 * t2 + m30 * t3;
  if (det === 0) {
    console.warn('4x4 Matrix inversion warnining, no inverse');
  }
  const d = 1.0 / det;

  v[0] = d * t0;
  v[1] = d * t1;
  v[2] = d * t2;
  v[3] = d * t3;
  v[4] =
    d *
    (tmp_1 * m10 +
      tmp_2 * m20 +
      tmp_5 * m30 -
      (tmp_0 * m10 + tmp_3 * m20 + tmp_4 * m30));
  v[5] =
    d *
    (tmp_0 * m00 +
      tmp_7 * m20 +
      tmp_8 * m30 -
      (tmp_1 * m00 + tmp_6 * m20 + tmp_9 * m30));
  v[6] =
    d *
    (tmp_3 * m00 +
      tmp_6 * m10 +
      tmp_11 * m30 -
      (tmp_2 * m00 + tmp_7 * m10 + tmp_10 * m30));
  v[7] =
    d *
    (tmp_4 * m00 +
      tmp_9 * m10 +
      tmp_10 * m20 -
      (tmp_5 * m00 + tmp_8 * m10 + tmp_11 * m20));
  v[8] =
    d *
    (tmp_12 * m13 +
      tmp_15 * m23 +
      tmp_16 * m33 -
      (tmp_13 * m13 + tmp_14 * m23 + tmp_17 * m33));
  v[9] =
    d *
    (tmp_13 * m03 +
      tmp_18 * m23 +
      tmp_21 * m33 -
      (tmp_12 * m03 + tmp_19 * m23 + tmp_20 * m33));
  v[10] =
    d *
    (tmp_14 * m03 +
      tmp_19 * m13 +
      tmp_22 * m33 -
      (tmp_15 * m03 + tmp_18 * m13 + tmp_23 * m33));
  v[11] =
    d *
    (tmp_17 * m03 +
      tmp_20 * m13 +
      tmp_23 * m23 -
      (tmp_16 * m03 + tmp_21 * m13 + tmp_22 * m23));
  v[12] =
    d *
    (tmp_14 * m22 +
      tmp_17 * m32 +
      tmp_13 * m12 -
      (tmp_16 * m32 + tmp_12 * m12 + tmp_15 * m22));
  v[13] =
    d *
    (tmp_20 * m32 +
      tmp_12 * m02 +
      tmp_19 * m22 -
      (tmp_18 * m22 + tmp_21 * m32 + tmp_13 * m02));
  v[14] =
    d *
    (tmp_18 * m12 +
      tmp_23 * m32 +
      tmp_15 * m02 -
      (tmp_22 * m32 + tmp_14 * m02 + tmp_19 * m12));
  v[15] =
    d *
    (tmp_22 * m22 +
      tmp_16 * m02 +
      tmp_21 * m12 -
      (tmp_20 * m12 + tmp_23 * m22 + tmp_17 * m02));

  return v;
}

export function lookAt4_4(
  cameraPosition: Matrix3_1,
  target: Matrix3_1,
  up: Matrix3_1,
  v: Matrix4_4 = new Float32Array(16),
  v3_s: Matrix3_1 = [0, 0, 0],
  v3_n: Matrix3_1 = [0, 0, 0],
  v3_m0: Matrix3_1 = [0, 0, 0],
  v3_m1: Matrix3_1 = [0, 0, 0],
  v3_m2: Matrix3_1 = [0, 0, 0],
  v3_m3: Matrix3_1 = [0, 0, 0]
): Matrix4_4 {
  const z = normalize3_1(subtract3_1(cameraPosition, target, v3_s), v3_n);
  const x = normalize3_1(multiply3_1(up, z, v3_m0), v3_m2);
  const y = normalize3_1(multiply3_1(z, x, v3_m1), v3_m3);

  v[0] = x[0];
  v[1] = x[1];
  v[2] = x[2];
  v[3] = 0;
  v[4] = y[0];
  v[5] = y[1];
  v[6] = y[2];
  v[7] = 0;
  v[8] = z[0];
  v[9] = z[1];
  v[10] = z[2];
  v[11] = 0;
  v[12] = cameraPosition[0];
  v[13] = cameraPosition[1];
  v[14] = cameraPosition[2];
  v[15] = 1;

  return v;
}

export function vectorMultiply(v: number[], m: Matrix4_4) {
  const dst = [];
  for (let i = 0; i < 4; ++i) {
    dst[i] = 0.0;
    for (let j = 0; j < 4; ++j) {
      dst[i] += v[j] * m[j * 4 + i];
    }
  }
  return dst;
}
