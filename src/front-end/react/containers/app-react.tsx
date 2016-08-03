import * as React from 'react';
import { connect } from 'react-redux';
import { keyPress } from '../../actions/events.actions';
import { changeGameType } from '../../actions/game.actions';
import { singletons } from '../../store/store';
import { registerKeyControls } from '../../controls';
import { boardToArray } from '../../../util';

import {
  ActivePiece,
  Block,
  Board, 
  InputDevice, 
} from '../components';

function mapStateToProps(state) {
  return {
    gameType: state.game.gameType,
    gameTypes: state.game.gameTypes,
    lastEvent: state.game.lastEvent,
  };
}

function mapDispatchToProps(dispatch)  {
  return {
    changeGameType: (type) => dispatch(changeGameType(type)),
    keyPress: (event) => dispatch(keyPress(event)),
  };
}

export const App = connect(
  mapStateToProps,
  mapDispatchToProps
)(React.createClass({
  deRegister: [],
  componentDidMount: function() {
    this.deRegister.push(this.state.game.on('redraw', () => {
      this.setState(() => ({
        board: boardToArray(singletons.engine.buffer,
          singletons.engine.config.width)
      }));
    }));

    const { controls } = this.state.game;

    this.deRegister.push(registerKeyControls({
      37: controls.moveLeft,
      38: controls.moveUp,
      39: controls.moveRight,
      40: controls.moveDown,
      81: controls.rotateLeft,
      87: controls.rotateRight,
    }, this.props.keyPress));
  },

  componentWillUnmount: function () {
    this.deRegister.forEach((unsubscribe) => unsubscribe());
    this.deRegister = [];
  },
  
  getInitialState: () => ({
    board: boardToArray(singletons.engine.buffer,
      singletons.engine.config.width),
    game: singletons.engine,
  }),

  render() {
    return (<div className='bd-app'>
      <h1>Block Drop</h1>
      <Board game= { this.state.game }
             board={ this.state.board } />
      <div className='bd-float'>
        <select name='game-type'
                value={ this.props.gameType }
                onChange={ this.gameType }>{
          this.props.gameTypes
            .map((opt, i) => <option key={i} value={i}>{
              opt
            }</option>)
        }</select>
        <div className='bd-float'>
          <h2>Next:</h2>
          { this.state.game.preview.map((block, i) => (
            <Block key={i} block={ block } />
          )) }
        </div>
        <div className='bd-debug bd-clear bd-float'>
          <InputDevice lastKeyCode={ this.props.lastEvent.keyCode } />
          <ActivePiece p={ this.state.game.activePiece() } />
        </div>
      </div>
    </div>);
  },
  gameType(event) {
    this.props.changeGameType(event.target.value);
  }
}));
