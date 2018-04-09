import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bd-button',
  template: `<input type="button" 
                    [value]="value" 
                    (click)="onClick($event)"
                    class="mh1 mh2-ns pa1 ph3-ns h2-5 h3-m h3-5-l ttu angular-red shadow-angular-red br3 br4-ns bg-transparent b--angular-red bw1 bw2-m bw3-l"/>`,
})
export class Button {
  @Input() value: string;
  @Input() onClick: Function;
}
