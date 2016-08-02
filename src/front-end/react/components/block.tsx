import * as React from 'react';
import { forEach } from '../../../engine/block';

const boxStyle = 'bd-border bd-border-white bd-margin-bottom bd-margin-left';

export function Block(props) {
  let cols = [];
  let desc = [];
  let lastJ = 0;
  
  forEach(props.block, (el, x, y, i, j) => {
    if (j !== lastJ) {
      cols.push(desc);
      desc = [];
      lastJ = j;
    }
    desc.push(el);
  });
  cols.push(desc);

  return (<div className={ boxStyle }>
    <table>
      <caption>{ props.block.name }</caption>
      <tbody>
      {
        cols.map((row, i) => (<tr key={i}>
          { row.map((el, j) => (<td key={j} className={
            el ? 'bd-border bd-border-white' : '' 
          }>{el || ''}</td>)) } 
        </tr>))
      }
      </tbody>
    </table>
  </div>);
}
