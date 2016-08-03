import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';

import { boxStyle } from '../../styles';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'block',
  template: `
    <div class="${boxStyle}">
      <table>
        <caption>{{ name }}</caption>
        <tbody>
          <tr *ngFor="let col of cols">
            <td *ngFor="let el of col"
              [ngClass]="el ? 'bd-border bd-border-white' : ''">
              {{ el || '' }}
            </td> 
          </tr>
        </tbody>
      </table>
    </div>
`,
})
export class Block {
  @Input() cols: number[][];
  @Input() name: string;
}
