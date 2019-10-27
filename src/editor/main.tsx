import { h, render } from 'preact';
import { Editor } from './editor';
import { LanguageState, UiToGameState } from '../interfaces';

export function main(
  container: HTMLElement,
  ls: LanguageState,
  utg: UiToGameState
) {
  render(<Editor languageState={ls} uiToGameState={utg} />, container);
}
