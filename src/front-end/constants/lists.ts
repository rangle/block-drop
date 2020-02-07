import { deepFreeze } from '../../util';

export const FRAMEWORK_DESCRIPTIONS = deepFreeze([
  { id: 'bd-root-vue', name: 'Vue', toggleElement: 'vue-toggle' },
  { id: 'bd-root-angular', name: 'Angular', toggleElement: 'angular-toggle' },
  { id: 'bd-root-react', name: 'React', toggleElement: 'react-toggle' },
]);

export const ROUTES = deepFreeze([
  {
    id: 'config',
    name: 'Config',
    path: 'config',
  },
  {
    id: 'game',
    name: 'Game',
    path: 'game',
  },
]);
