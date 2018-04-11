import * as React from 'react';

export function Button({ onClick, value }) {
  return (<input type='button' value={ value } onClick={ onClick } readOnly className='w-100 pa1 pa3-ns ttu react-blue shadow-react-blue br3 br4-ns bg-transparent b--react-blue bw1 bw2-m bw3-l'/>);
}
