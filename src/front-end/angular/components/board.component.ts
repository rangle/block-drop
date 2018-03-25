import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';
import {
  board,
  emptyTile,
  flexGrowRow,
  tileByNumber,
} from '../../styles';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'board',
  template: `
    <div class="ba bw2 b--angular-red mr4 shadow-angular-red">
      <h3 class="black bg-angular-red f3 mb0 mt0 tc">LEVEL {{level}}</h3>
      <div class="${board}" [ngStyle]="styles ? styles : {}">
        <div class="${flexGrowRow}" *ngFor="let row of board; trackBy: trackCol">
          <tile [ngClass]="tile === 0 ? emptyTile : tileByNumber(tile)"
            *ngFor="let tile of row; trackBy: trackRow" [value]="tile"></tile>
        </div>
      </div>
    </div>
`,
})
export class Board {
  @Input() board: number[][];
  @Input() level: number;
  @Input() width: number;
  @Input() isPaused: boolean;
  @Input() styles: Object;

  cols: number[][];
  emptyTile: string = emptyTile;
  rows: number[];
  tileByNumber = tileByNumber;

  trackCol(index: number) {
    return index;
  }

  trackRow(index: number, value: number) {
    return value;
  }
}
