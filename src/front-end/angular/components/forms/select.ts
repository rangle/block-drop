import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bd-select',
  template: `
    <select [ngModel]="model" (change)="update.emit($event.target.value)">
      <option 
        *ngFor="let selected of options; let i = index" [value]="i">
          {{ selected }}
      </option> 
    </select>

`,
})
export class Select {
  @Input() model: number;
  @Input() options: string[];
  @Output() update: EventEmitter<number> = new EventEmitter<number>();
}
