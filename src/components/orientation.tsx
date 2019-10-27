import { h } from 'preact';
import { Position } from './position';
import { Matrix3_1, TRS } from '../interfaces';
import { degreesToRadians, radiansToDegrees } from '../utility/util';

export function Orientation(props: {
  label: { t: string; r: string; s: string };
  onChange: (value: TRS) => void;
  value: TRS;
}) {
  // @todo do coordinates translate?
  const x = 'x';
  const y = 'y';
  const z = 'z';

  const rotation = props.value.rotation.map(radiansToDegrees) as Matrix3_1;

  const changeT = (t: Matrix3_1) => {
    const r = props.value.rotation;
    const s = props.value.scale;

    props.onChange({
      translation: t,
      rotation: r.slice(0) as Matrix3_1,
      scale: s.slice(0) as Matrix3_1,
    });
  };

  const changeR = (r: Matrix3_1) => {
    r[0] = degreesToRadians(r[0]);
    r[1] = degreesToRadians(r[1]);
    r[2] = degreesToRadians(r[2]);
    const t = props.value.translation;
    const s = props.value.scale;

    props.onChange({
      translation: t.slice(0) as Matrix3_1,
      rotation: r,
      scale: s.slice(0) as Matrix3_1,
    });
  };

  const changeS = (s: Matrix3_1) => {
    const t = props.value.translation;
    const r = props.value.rotation;

    props.onChange({
      translation: t.slice(0) as Matrix3_1,
      rotation: r.slice(0) as Matrix3_1,
      scale: s,
    });
  };

  return (
    <div>
      <div>
        <label>
          {props.label.t}
          <Position
            label={{ x, y, z }}
            onChange={changeT}
            value={props.value.translation}
          />
        </label>
      </div>
      <div>
        <label>
          {props.label.r}
          <Position label={{ x, y, z }} onChange={changeR} value={rotation} />
        </label>
      </div>
      <div>
        <label>
          {props.label.s}
          <Position
            label={{ x, y, z }}
            onChange={changeS}
            value={props.value.scale}
          />
        </label>
      </div>
    </div>
  );
}
