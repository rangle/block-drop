import { h } from 'preact';
import { Position } from './position';
import { Matrix3_1 } from '../interfaces';

export function Cameras(props: {
  onChange: (...args: Matrix3_1[]) => void;
  values?: Matrix3_1[];
}) {
  // @todo do coordinates translate?
  const x = 'x';
  const y = 'y';
  const z = 'z';
  const value =
    props.values && props.values.length
      ? props.values[0]
      : ([1, 2, 3] as Matrix3_1);

  return (
    <Position label={{ x, y, z }} onChange={props.onChange} value={value} />
  );
}
