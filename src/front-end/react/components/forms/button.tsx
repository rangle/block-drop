import * as React from 'react';

export function Button({ onClick, value }) {
  return (<input value={ value } onClick={ onClick } readOnly />);
}
