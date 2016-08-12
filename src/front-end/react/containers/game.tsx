import * as React from 'react';
import { connect } from 'react-redux';
import { keyPress } from '../../actions/events.actions';
import { singletons } from '../../store/store';
import { registerKeyControls } from '../../controls';
import { boardToArray } from '../../../util';
import { bindResizeToWindow, resize } from '../../aspect-resizer';
import {
  flex,
  flexNoWrap,
  previewDebug,
} from '../../styles';

const gameViewportClass = `${flex} ${flexNoWrap}`;

import {
  Board,
  Debug,
  NextPieces,
} from '../components';

function mapStateToProps(state) {
  return {
    lastEvent: state.game.lastEvent,
    styles: {
      flexDirection: state.game.currentGameViewportDimensions.direction,
    },
    subStyles: {
      minWidth: state.game.currentGameViewportDimensions.x + 'px',
      minHeight: state.game.currentGameViewportDimensions.y + 'px',
      maxWidth: state.game.currentGameViewportDimensions.x + 'px',
      maxHeight: state.game.currentGameViewportDimensions.y + 'px',
    },
  };
}

function mapDispatchToProps(dispatch)  {
  return {
    keyPress: (event) => dispatch(keyPress(event)),
  };
}

export const Game = connect(
  mapStateToProps,
  mapDispatchToProps
)(React.createClass({
  deRegister: [],
  componentDidMount: function() {
    resize();
    const updateBoard = () => ({
      board: boardToArray(singletons.engine.buffer,
        singletons.engine.config.width)
    });
    this.deRegister.push(bindResizeToWindow());
    this.deRegister.push(
      this.state.game.on('redraw', () => this.setState(updateBoard)));

    this.deRegister.push(singletons.on('new-game', this.setState(updateBoard)));

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
    return (<div className={ gameViewportClass } style={ this.props.styles }>
      <Board game={ this.state.game }
             board={ this.state.board }
             width={ this.state.game.config.width }
             styles={ this.props.subStyles } />
      <div className={ previewDebug }>
        <NextPieces preview={ this.state.game.preview } />
        <Debug activePiece={ this.state.game.activePiece }
               lastEvent={ this.props.lastEvent } />
      </div>
    </div>);
  },
}));
