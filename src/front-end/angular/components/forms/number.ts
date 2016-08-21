import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import {
  numberFromString,
} from '../../../../util';

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

    if (this.min === this.min) {
      if (val < this.min) {
        this.model = this.min;
        val = this.min
      }
    }

    if (this.max === this.max) {
      if (val > this.max) {
        this.model = this.max;
        val = this.max
      }
    }

    this.update.emit(val);
  }
}
