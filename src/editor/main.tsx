import { h, render } from 'preact';
import { Editor } from './editor';
import { LanguageState } from '../interfaces';

export function main(container: HTMLElement, ls: LanguageState) {
  render(<Editor languageState={ ls } />, container);
}
