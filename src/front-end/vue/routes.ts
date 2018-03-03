import { Config } from './containers/config';
import { Game } from './containers/game';

export const routes = () => ({
  '/': {
    component: Game(),
    name: 'Game',
    path: '',
  },
  '/config': {
    component: Config(),
    name: 'Config',
    path: 'config',
  },
  '/game': {
    component: Game(),
    name: 'Game',
    path: 'game',
  },
});
