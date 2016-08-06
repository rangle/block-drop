import { app, IApp } from './app.reducer';
import { combineReducers } from 'redux';
import { game, IGameState } from './game.reducer';
import { framework, IFramework } from './framework.reducer';

export interface IState {
  app: IApp;
  framework: IFramework;
  game: IGameState;
}

export const root = combineReducers<IState>({
  app,
  framework,
  game,
});
