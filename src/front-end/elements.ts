const DEFAULT_DISPLAY = 'flex';

export interface Dictionary {
  [key: string]: string;
}
const displayStates: Dictionary = Object.create(null);

export function hide(element: HTMLElement) {
  const current = element.style.display;
  if (current === 'none') {
    return;
  }
  displayStates[element.id] = current;
  element.style.display = 'none';
}

export function show(element: HTMLElement) {
  const display = displayStates[element.id] || DEFAULT_DISPLAY;
  element.style.display = display;
}
