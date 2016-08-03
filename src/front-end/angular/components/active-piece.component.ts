import {
  ChangeDetectionStrategy,
  Component,
  Input,
} from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'active-piece',
  template: `
    <table>
      <caption>{{ name }}</caption>
      <tbody>
        <tr><th>Detail</th><th>X</th><th>Y</th></tr>
        <tr><td>Pos: </td><td>{{ x }}</td><td>{{ y }}</td></tr>
        <tr><td>Centre:</td><td>{{ centreX }}</td><td>{{ centreY }}</td></tr>
        <tr><td>Dimensions:</td><td>{{ height }}</td><td>{{ width }}</td></tr>
        <tr><td colSpan='3'>{{ desc }}</td></tr>
      </tbody>
    </table>
    
  `,
})
export class ActivePiece {
  @Input() centreX: number;
  @Input() centreY: number;
  @Input() desc: string;
  @Input() height: number;
  @Input() name: string;
  @Input() width: number;
  @Input() x: number;
  @Input() y: number;
}
