import { deepFreeze } from '../../util';

export const FRAMEWORK_DESCRIPTIONS = deepFreeze([
  { id: 'bd-root-angular', name: 'Industrial' },
  { id: 'bd-root-react', name: 'DX' },
  { id: 'bd-root-vue', name: 'Vue' },
]);

export const ROUTES = deepFreeze([{
  id: 'config',
  name: 'Config',
  path: 'config',
}, {
  id: 'game',
  name: 'Game',
  path: 'game',
}]);
