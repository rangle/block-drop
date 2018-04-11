import * as React from 'react';
import { connect } from 'react-redux';
import { keyPress } from '../../actions/events.actions';
import { registerKeyControls } from '../../controls';
import { boardToArray } from '../../../util';
import { Board, Button, Score, NextPieces } from '../components';

function mapStateToProps(state) {
  return {
    activePiece: state.game.activePiece,
    board: boardToArray(state.game.buffer, state.game.config.width),
    level: state.game.level,
    score: state.game.score,
    lastEvent: state.game.lastEvent,
    isPaused: state.game.isPaused,
    preview: state.game.preview,
    width: state.game.config.width,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    keyPress: event => dispatch(keyPress(event)),
  };
}

export const Game = connect(mapStateToProps, mapDispatchToProps)(
  React.createClass({
    deRegister: [],
    componentDidMount: function() {
      this.props.resizer.resize();
      this.deRegister.push(this.props.resizer.bind());

      const controls = this.props.store.game.controls();

      this.deRegister.push(
        registerKeyControls(
          {
            37: controls.moveLeft,
            38: controls.moveUp,
            39: controls.moveRight,
            40: controls.moveDown,
            81: controls.rotateLeft,
            87: controls.rotateRight,
          },
          this.props.keyPress,
        ),
      );
    },

    componentWillUnmount: function() {
      this.deRegister.forEach(unsubscribe => unsubscribe());
      this.deRegister = [];
    },

    render() {
      const { stop, pause, resume } = this.props.store.game;
      return (
        <div className='flex pa2 pa4-ns flex-auto'>
          {this.props.isPaused ? null : (
            <Board
              board={this.props.board}
              level={this.props.level}
              width={this.props.width}
            />
          )}
          <div className='w-third'>
            <Score score={this.props.score} />
            {this.props.isPaused ? null : (
              <NextPieces preview={this.props.preview} />
            )}
            <div className='flex flex-wrap justify-between man1 man2-ns'>
              {this.props.isPaused ? (
                <div className="flex-auto ma1 ma2-ns"><Button value='Resume' onClick={resume}/></div>
              ) : (
                <div className="flex-auto ma1 ma2-ns"><Button value='Pause' onClick={pause} className="flex-auto ma1 ma2-ns"/></div>
              )}
                <div className="flex-auto ma1 ma2-ns"><Button value='Done' onClick={stop} className="flex-auto ma1 ma2-ns"/></div>
            </div>
          </div>
        </div>
      );
    },
  }),
);
