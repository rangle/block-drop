import {
  Block,
} from './block.component';

import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [Block],
  selector: 'bd-next-pieces',
  template: `
    <h2>Next:</h2>
    <block *ngFor="let p of preview" 
      [name]="p.name" 
      [cols]="p.cols"></block>
  `,
})
export class NextPieces {
  @Input() preview: { name: string, cols: number[][]};
}
