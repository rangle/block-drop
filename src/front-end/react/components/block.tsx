import * as React from 'react';
import { columnsFromBlock } from '../../../engine/block';

const boxStyle = 'bd-border bd-border-white bd-margin-bottom bd-margin-left';

export function Block(props) {
  const cols = columnsFromBlock(props.block);

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
