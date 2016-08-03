import { Injectable } from '@angular/core';
import { Singletons as S, singletons } from '../store/store';

@Injectable()
export class Singletons implements S {
  engine: any;
  constructor() {
    Object.keys(singletons).forEach((key) => this[key] = singletons[key]);
  }
}
