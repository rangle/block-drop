import {
  Block,
} from './block.component';

import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';

import {
  flexGrowCol,
} from '../../styles';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [Block],
  selector: 'bd-next-pieces',
  template: `
    <h3>Next:</h3>
    <block class="${flexGrowCol}"
      *ngFor="let p of preview" 
      [name]="p.name" 
      [cols]="p.cols"></block>
  `,
})
export class NextPieces {
  @Input() preview: { name: string, cols: number[][]};
}
