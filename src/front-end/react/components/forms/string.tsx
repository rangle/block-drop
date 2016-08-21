import * as React from 'react';
import { identity } from '../../../../util';

export function String({ value, onChange, sanitize }) {
  if (sanitize === undefined) {
    sanitize = identity;
  }
  return (
    <input type='text'
           onChange={ (e) => onChange(sanitize(e.target.value)) }
           value={ value } />
  );
}
