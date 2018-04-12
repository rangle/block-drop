import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bd-button',
  template: `<input type="button" 
                    [value]="value" 
                    (click)="onClick($event)"
                    class="w-100 pa1 pa3-ns ttu angular-red shadow-angular-red br3 br4-ns bg-transparent b--angular-red bw1 bw2-m bw3-l"/>`,
})
export class Button {
  @Input() value: string;
  @Input() onClick: Function;
}
