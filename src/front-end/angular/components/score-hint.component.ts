import { Component, Input, HostBinding } from '@angular/core';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { tileColorByNumber } from '../../styles';

@Component({
  selector: 'score-hint',
  host: {
    class: 'dib absolute'
  },
  template: `
    <div *ngIf="canShow()" [ngClass]="getClass">
      <div class="mbn-50 mln-50 tc dib">
        <span class="f3 0-20">{{ text }}</span><br/>
        <span class="0-30">+{{ score }}</span>
      </div>
    </div>
`,
})
export class ScoreHint {
  @Input() colour: 10 | 20 | 30 | -10;
  @Input() text: string = '';
  @Input() score: number;
  @Input() duration: number;
  @Input() startTime: number;
  @Input() position: { xPercent: number, yPercent: number };
  @HostBinding('style') hostStyle: SafeStyle = '';
  jitterX: number;
  jitterY: number;

  ngOnInit() {
    this.jitterX = Math.floor(Math.random() * 8) - 4;
    this.jitterY = Math.floor(Math.random() * 8) - 4;
  }
  
  ngOnChanges() {
    /* eh... */
    this.hostStyle = this.sanitizer.bypassSecurityTrustStyle(
      `left: ${this.position.xPercent +this.jitterX}%; 
       bottom: ${this.position.yPercent + this.jitterY}%;`);
  }

  canShow() {
    if (this.score <= 0) {
      return false;
    }
    if ((Date.now() - this.startTime > 0) && (Date.now() - this.startTime < this.duration)) {
      // console.log(this.text, this.score)
      return true;
    }
    return false;
  }

  get getClass() {
    return tileColorByNumber(this.colour) + ' animated animate-slow fadeOutUp f1';
  }

  constructor(private sanitizer: DomSanitizer) {}
}
