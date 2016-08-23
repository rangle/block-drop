import {RouterConfig} from '@angular/router';
import { GameConfig, Game } from './containers';

export const routes: RouterConfig = [
  { path: '', redirectTo: '/game', pathMatch: 'full' },
  { path: 'config', component: GameConfig },
  { path: 'game', component: Game },
  { path: '**', redirectTo: '/game', pathMatch: 'full' },
];
