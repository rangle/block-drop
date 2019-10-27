import { h } from 'preact';

export function Int(props: {
  label: string;
  onChange: (newValue: number) => void;
  value: number;
}) {
  const change = (e: any) => {
    const n =
      typeof e.target.value === 'number'
        ? e.target.value
        : parseInt(e.target.value, 10);
    props.onChange(n);
  };

  return (
    <label>
      {props.label}
      <input
        style="width: 3.5em;"
        value={props.value}
        type="number"
        onBlur={change}
        onChange={change}
      />
    </label>
  );
}
