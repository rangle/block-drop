import * as React from 'react';
import { clamp, numberFromString } from '../../../../util';

export function Number({ value, onChange, min, max }) {
  if (min === undefined) {
    min = NaN;
  }
  if (max === undefined) {
    max = NaN;
  }
  return (
    <input type='text'
           onChange={ (e) => onChange(
             clamp(
               numberFromString(e.target.value),
               min, max)) }
           value={ value } />
      );
}
