import { h } from 'preact';
import { Matrix3_1 } from '../interfaces';
import { Int } from './int';
import { clamp, hexToInt, intToHex } from '../utility/util';

const supportsColour = detectHtml5ColourInput();

export function Colour(props: {
  label: string;
  onChange: (colour: Matrix3_1) => void;
  value: Matrix3_1;
}) {
  const r = 'r';
  const g = 'g';
  const b = 'blue';

  const changeInt = (index: number) => (e: any) => {
    const newVal = clamp(e.target.value, 0, 255);
    const newArr: Matrix3_1 = [props.value[0], props.value[1], props.value[2]];
    newArr[index] = newVal;
    props.onChange(newArr);
  };

  const changeColur = (e: any) => {
    const newVal = hexToInt(e.target.value);
    props.onChange(newVal);
  };

  const body = supportsColour ? (
    <input type="color" onChange={changeColur} value={intToHex(props.value)} />
  ) : (
    <span>
      <Int label={r} onChange={changeInt(0)} value={props.value[0]} />
      <Int label={g} onChange={changeInt(1)} value={props.value[1]} />
      <Int label={b} onChange={changeInt(2)} value={props.value[2]} />
    </span>
  );
  return (
    <label>
      {props.label}
      {body}
    </label>
  );
}

function detectHtml5ColourInput() {
  const sample = '<input type="color" value="!" />';
  const container = window.document.createElement('span');
  container.innerHTML = sample;
  let colourInput: HTMLInputElement | void = undefined;
  for (let i = 0; i < container.children.length; i += 1) {
    if (container.children[i].nodeName === 'input') {
      const child = container.children[i] as HTMLInputElement;
      colourInput = child;
      break;
    }
  }

  if (colourInput && colourInput.type === 'color') {
    if (colourInput.value === '!') {
      return false;
    }
    return true;
  }
  return false;
}
