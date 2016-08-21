import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'tile',
  template: `{{ value }}`,
})
export class Tile {
  @Input() value: number;
}
