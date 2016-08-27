import * as React from 'react';
import { connect } from 'react-redux';
import { keyPress } from '../../actions/events.actions';
import { registerKeyControls } from '../../controls';
import { boardToArray } from '../../../util';
import {
  flex,
  flexNoWrap,
  previewDebug,
} from '../../styles';
import {
  Board,
  Debug,
  NextPieces,
} from '../components';

const gameViewportClass = `${flex} ${flexNoWrap}`;

function mapStateToProps(state) {
  return {
    activePiece: state.game.activePiece,
    board: boardToArray(state.game.buffer, state.game.config.width),
    lastEvent: state.game.lastEvent,
    preview: state.game.preview,
    styles: {
      flexDirection: state.game.currentGameViewportDimensions.direction,
    },
    subStyles: {
      minWidth: state.game.currentGameViewportDimensions.x + 'px',
      minHeight: state.game.currentGameViewportDimensions.y + 'px',
      maxWidth: state.game.currentGameViewportDimensions.x + 'px',
      maxHeight: state.game.currentGameViewportDimensions.y + 'px',
    },
    width: state.game.config.width,
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
    this.props.resizer.resize();
    this.deRegister.push(this.props.resizer.bind());

    const controls = this.props.store.game.controls();

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

  render() {
    return (<div className={ gameViewportClass } style={ this.props.styles }>
      <Board board={ this.props.board }
             width={ this.props.width }
             styles={ this.props.subStyles } />
      <div className={ previewDebug }>
        <NextPieces preview={ this.props.preview } />
        <Debug activePiece={ this.props.activePiece }
               lastEvent={ this.props.lastEvent } />
      </div>
    </div>);
  },
}));
