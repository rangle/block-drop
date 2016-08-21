import { deepFreeze } from '../../util';

export const FRAMEWORK_DESCRIPTIONS = deepFreeze([
  { id: 'bd-root-angular', name: 'Angular 2' },
  { id: 'bd-root-react', name: 'React' },
]);

export const SCREENS = deepFreeze([{
  id: 'config',
  name: 'Config',
}, {
  id: 'game',
  name: 'Game',
}]);
