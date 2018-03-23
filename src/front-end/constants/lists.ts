import { deepFreeze } from '../../util';

export const FRAMEWORK_DESCRIPTIONS = deepFreeze([
  { id: 'bd-root-vue', name: 'Vue' },
  { id: 'bd-root-angular', name: 'Angular' },
  { id: 'bd-root-react', name: 'React' },
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
