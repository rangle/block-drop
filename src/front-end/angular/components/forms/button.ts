import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bd-button',
  template: `<input type="button" [value]="value" (click)="onClick($event)" />`,
})
export class Button {
  @Input() value: string;
  @Input() onClick: Function;
}
