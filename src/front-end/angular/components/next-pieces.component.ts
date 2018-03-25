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
  selector: 'bd-next-pieces',
  template: `
    <div class="ba bw2 b--angular-red mb4 shadow-angular-red">
      <h3 class="black bg-angular-red f3 mb0 mt0 tc">NEXT</h3>
      <div class="ph3 pv3">
        <block class="${flexGrowCol}"
          *ngFor="let p of preview" 
          [name]="p.name" 
          [cols]="p.cols"></block>
      </div>
    </div>
  `,
})
export class NextPieces {
  @Input() preview: { name: string, cols: number[][]};
}
