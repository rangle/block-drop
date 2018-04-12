import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { clamp, numberFromString } from '../../../../util';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bd-number',
  template: `
    <input 
      type='string' 
      [ngModel]="model" 
      (change)="onChange($event)">
`,
})
export class Number {
  @Input() model: number;
  @Input() min: number = NaN;
  @Input() max: number = NaN;
  @Output() update: EventEmitter<number> = new EventEmitter<number>();

  onChange($event) {
    let val = numberFromString($event.target.value);

    this.model = clamp(val, this.min, this.max);
    this.update.emit(val);
  }
}
