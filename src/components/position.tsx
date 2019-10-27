import { h } from 'preact';
import { Float } from './float';
import { Matrix3_1 } from '../interfaces';

export function Position(props: {
  label: { x: string; y: string; z: string };
  onChange: (updated: Matrix3_1) => void;
  value: Matrix3_1;
}) {
  const l = props.label;
  const v = props.value;
  const c = props.onChange;

  return (
    <div>
      <Float
        label={l.x}
        onChange={(nv: number) => c([nv, v[1], v[2]])}
        value={v[0]}
      />
      <Float
        label={l.y}
        onChange={(nv: number) => c([v[0], nv, v[2]])}
        value={v[1]}
      />
      <Float
        label={l.z}
        onChange={(nv: number) => c([v[0], v[1], nv])}
        value={v[2]}
      />
    </div>
  );
}
