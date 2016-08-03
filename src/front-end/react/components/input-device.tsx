import * as React from 'react';

export function InputDevice (props) {
  const { lastKeyCode } = props;
  return (<table>
    <caption>Input</caption>
    <tbody>
    <tr>{ lastKeyCode }</tr>
    </tbody>
  </table>);
}
