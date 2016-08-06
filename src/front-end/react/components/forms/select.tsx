import * as React from 'react';

export function Select({ selected, options, onChange }) {
  return (<select name='game-type'
                  value={ selected }
                  onChange={ (e) => onChange(e.target.value) }>{
    options.map((opt, i) => <option key={i} value={i}>{ opt }</option>)
  }</select>);
}
