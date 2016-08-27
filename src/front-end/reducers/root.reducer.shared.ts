import { app, IAppState } from './app.reducer';
import { game, IGameState } from './game.reducer';
import { GameConfig } from '../../interfaces';
import { nextConfig } from './next-config.reducer';

export interface IState {
  app: IAppState;
  game: IGameState;
  nextConfig: GameConfig;
}

export const rootObject = {
  app,
  game,
  nextConfig,
};
