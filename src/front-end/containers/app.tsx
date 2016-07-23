import * as React from 'react';
import { create1 } from '../../engine/engine';
import { ActivePiece, Board, InputDevice } from '../components';

const game = create1();
const board = game.buffer;

function boardToArray(b) {
  return Array.from(b.slice(game.config.width * 2));
}

export const App = React.createClass({
  componentDidMount: function() {
    this.state.game.on('render', () => {
      this.setState(() => ({ board: boardToArray(board)})); 
    }); 
    
    window.addEventListener('keydown', (e) => {
      switch (e.keyCode) {
        case 37:
          this.state.game.emit('left');
          break;
        case 38:
          this.state.game.emit('up');
          break;
        case 39:
          this.state.game.emit('right');
          break;
        case 40:
          this.state.game.emit('down');
          break;
        case 81:
          this.state.game.emit('rotateLeft');
          break;
        case 87:
          this.state.game.emit('rotateRight');
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
      <div className='bd-debug bd-float'>
        <InputDevice lastKeyCode={ this.state.lastEvent.keyCode } />
        <ActivePiece p={ this.state.game.activePiece } />
      </div>
    </div>);
  },
});
