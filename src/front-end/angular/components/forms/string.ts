import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FORM_DIRECTIVES } from '@angular/forms';

import {
  identity,
} from '../../../../util';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [FORM_DIRECTIVES],
  selector: 'bd-number',
  template: `
    <input 
      type='string' 
      [ngModel]="model" 
      (change)="onChange($event)">
`,
})
export class String {
  @Input() model: string;
  @Input() sanitizer: (val: string) => string = identity;
  @Output() update = new EventEmitter<string>();

  onChange($event) {
    this.update.emit(
      this.sanitizer($event.target.value)
    );
  }
}
