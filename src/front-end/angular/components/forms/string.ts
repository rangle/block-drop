import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

import { identity } from '../../../../util';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bd-string',
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
    this.update.emit(this.sanitizer($event.target.value));
  }
}
