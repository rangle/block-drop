import { Injectable } from '@angular/core';
import { Singletons as S, singletons } from '../store/store';

@Injectable()
export class Singletons implements S {
  configInterfaces;
  createEngine: Function;
  engine: any;
  on: (message: string, listener: Function) => any;
  constructor() {
    Object.keys(singletons).forEach((key) => this[key] = singletons[key]);
  }
}
