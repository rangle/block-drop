import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';

import {
  flexGrowRow,
  tileByNumber,
} from '../../styles';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'block',
  template: `
    {{ name }}
    <div class="${flexGrowRow}" *ngFor="let row of cols; trackBy: trackCol">
      <tile
        *ngFor="let tile of row; trackBy: trackRow"
        [value]="tile"
      ></tile>
    </div>
`,
})
export class Block {
  @Input() cols: number[][];
  @Input() name: string;
  tileByNumber: Function;

  constructor() {
    this.tileByNumber = tileByNumber;
  }

  trackCol(index: number) {
    return index;
  }

  trackRow(index: number, value: number) {
    return value;
  }
}
