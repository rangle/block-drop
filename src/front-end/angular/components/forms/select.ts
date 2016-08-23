import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { FORM_DIRECTIVES } from '@angular/forms';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  directives: [FORM_DIRECTIVES],
  selector: 'bd-select',
  template: `
    <select [ngModel]="model" 
    (change)="update.emit({ 
    index: $event.target.value, 
    value: byValue ? $event.target.value : options[$event.target.value]
    })">
      <option 
        *ngFor="let selected of options; let i = index" 
        [value]="byValue ? selected : i">
          {{ selected }}
      </option> 
    </select>

`,
})
export class Select {
  @Input() model: number;
  @Input() options: string[];
  @Input() byValue: boolean = false;
  @Output() update: EventEmitter<{ index: number, value: string}> =
    new EventEmitter<{ index: number, value: string}>();
}
