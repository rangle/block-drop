import * as React from 'react';

export function Select({ byValue, selected, options, onChange }) {
  if (byValue) {
    return (<select value={ selected }
                  onChange={ (e) => onChange(e.target.value) }>{
    options.map((opt, i) => <option key={i} value={opt}>{ opt }</option>)
  }</select>);
  }
  return (<select value={ selected }
                  onChange={ (e) => onChange(e.target.value) }>{
    options.map((opt, i) => <option key={i} value={i}>{ opt }</option>)
  }</select>);
}
