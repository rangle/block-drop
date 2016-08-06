import {
  CHANGE_FRAMEWORK,
  CHANGE_MULTI_FRAMEWORK,
  CHANGE_SCREEN,
} from './action-types';

export function changeFramework(fw: number) {
  return {
    type: CHANGE_FRAMEWORK,
    payload: fw,
  };
}

export function changeMultiFramework(useMultiFramework: boolean) {
  return {
    type: CHANGE_MULTI_FRAMEWORK,
    payload: useMultiFramework,
  };
}

export function changeScreen(screen: string) {
  return {
    type: CHANGE_SCREEN,
    payload: screen,
  };
}
