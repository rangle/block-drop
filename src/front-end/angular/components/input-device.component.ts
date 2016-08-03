import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'input-device',
  template: `
    <table>
      <caption>Input</caption>
      <tbody>
        <tr><td>{{ lastKeyCode }}</td></tr>
      </tbody>
    </table>
`,
})
export class InputDevice {
  @Input() lastKeyCode: number;
}
