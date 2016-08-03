import { combineReducers } from 'redux';
import { game, IGameState } from './game.reducer';
import { framework, IFramework } from './framework.reducer';

export interface IState {
  framework: IFramework;
  game: IGameState;
}

export const root = combineReducers<IState>({
  framework,
  game,
});
