import * as React from 'react';
import { create1 } from '../../engine/engine';

import {
  ActivePiece,
  Block,
  Board, 
  InputDevice, 
} from '../components';

const game = create1({ preview: 3 });
const board = game.buffer;

function boardToArray(b) {
  return Array.from(b.slice(game.config.width * 2));
}

export const App = React.createClass({
  componentDidMount: function() {
    this.state.game.on('redraw', () => {
      this.setState(() => ({ board: boardToArray(board)})); 
    }); 
    
    window.addEventListener('keydown', (e) => {
      switch (e.keyCode) {
        case 37:
          this.state.game.controls.moveLeft();
          break;
        case 38:
          this.state.game.controls.moveUp();
          break;
        case 39:
          this.state.game.controls.moveRight();
          break;
        case 40:
          this.state.game.controls.moveDown();
          break;
        case 81:
          this.state.game.controls.rotateLeft();
          break;
        case 87:
          this.state.game.controls.rotateRight();
          break;
        default:
          break;
      }
      
      this.state.lastEvent = { keyCode: e.keyCode };
    });
  },
  
  getInitialState: () => ({
    board: boardToArray(board),
    game,
    lastEvent: { keyPress: null },
  }),
  render: function() {
    return (<div className='bd-app'>
      <h1>Block Drop</h1>
      <Board game= { this.state.game }
             board={ this.state.board } />
      <div className='bd-float'>
        <div className='bd-float'>
          <h2>Next:</h2>
          { this.state.game.preview.map((block, i) => (
            <Block key={i} block={ block } />
          )) }
        </div>
        <div className='bd-debug bd-clear bd-float'>
          <InputDevice lastKeyCode={ this.state.lastEvent.keyCode } />
          <ActivePiece p={ this.state.game.activePiece } />
        </div>
      </div>
    </div>);
  },
});
