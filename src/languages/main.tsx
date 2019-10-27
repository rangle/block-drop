import { h, render } from 'preact';
import { Languages } from './languages';
import { LanguageState } from '../interfaces';

export function main(container: HTMLElement, languageState: LanguageState) {
  render(<Languages languageState={ languageState } />, container);
}
