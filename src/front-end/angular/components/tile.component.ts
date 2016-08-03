import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import {
  activeTile,
  emptyTile,
} from '../../styles';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tile',
  template: `
    <div [ngClass]="style">{{ value }}</div>
`,
})
export class Tile implements OnChanges {
  @Input() value: number | string;
  style: string = emptyTile;

  ngOnChanges() {
    this.style = this.value === 0 ? emptyTile : activeTile;
  }
}
