import * as React from 'react';

export function ActivePiece (props) {
  const { p } = props;
  return (<table>
    <caption>{ p.name }</caption>
    <tbody>
    <tr><th>Detail</th><th>X</th><th>Y</th></tr>
    <tr><td>Pos: </td><td>{ p.x }</td><td>{ p.y }</td></tr>
    <tr><td>Centre:</td><td>{ p.centreX }</td><td>{ p.centreY }</td></tr>
    <tr><td>Dimensions:</td><td>{ p.height }</td><td>{ p.width }</td></tr>
    <tr><td colSpan='3'>{ JSON.stringify(p.desc, null, 2) }</td></tr>
    </tbody>
  </table>);
}
