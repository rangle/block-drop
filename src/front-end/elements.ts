const DEFAULT_DISPLAY = 'flex';
const DEFAULT_VISIBILITY = '';

export interface Dictionary {
  [key: string]: string;
}
const displayStates: Dictionary = Object.create(null);
const visibilityStates: Dictionary = Object.create(null);

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

export function makeInvisible(element: HTMLElement) {
  const current = element.style.visibility;
  if (current === 'hidden') {
    return;
  }
  visibilityStates[element.id] = current;
  element.style.visibility = 'hidden';
}

export function makeVisible(element: HTMLElement) {
  const visibility = visibilityStates[element.id] || DEFAULT_VISIBILITY;
  element.style.visibility = visibility;
}
