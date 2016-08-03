import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';
import { Tile } from './tile.component';
import { boardStyle } from '../../styles';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [ Tile ],
  selector: 'board',
  template: `
    <div class="bd-float">rows: {{ rowsCleared }}</div>
    <div class="${boardStyle}">
      <tile *ngFor="let tile of board" [value]="tile"></tile>
    </div>
`,
})
export class Board {
  @Input() board: number[];
  @Input() rowsCleared: number;
}
