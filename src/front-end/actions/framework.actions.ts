import { CHANGE_FRAMEWORK } from './action-types';

export function changeFramework(type: string) {
  return {
    type: CHANGE_FRAMEWORK,
    payload: type,
  };
}
