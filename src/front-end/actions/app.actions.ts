import {
  CHANGE_FRAMEWORK,
  CHANGE_MULTI_FRAMEWORK,
  ROUTE_BINDING_BOOTSTRAP,
} from '../constants';

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

export function bootstrapRoutes(path: string) {
  return {
    type: ROUTE_BINDING_BOOTSTRAP,
    payload: path,
  };
}
