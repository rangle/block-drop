import { app, IAppState } from './app.reducer';
import { combineReducers } from 'redux';
import { game, IGameState } from './game.reducer';
import { GameConfig } from '../../interfaces';
import { nextConfig } from './next-config.reducer';



export interface IState {
  app: IAppState;
  game: IGameState;
  nextConfig: GameConfig;
}

export const root = combineReducers<IState>({
  app,
  game,
  nextConfig,
});
