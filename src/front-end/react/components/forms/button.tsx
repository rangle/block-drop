import * as React from 'react';

export function Button({ onClick, value }) {
  return (<input type='button' value={ value } onClick={ onClick } readOnly />);
}
