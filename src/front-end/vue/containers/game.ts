import { registerKeyControls } from '../../controls';
import { keyPress } from '../../actions/events.actions';
import {
  gameViewportClass,
  previewDebug,
} from '../../styles';
import { recomputeBoard, noop } from '../../../util';
import { Board, Button, NextPieces, Score } from '../components';
import { columnsFromBlock } from '../../../engine/block';

export const Game = () => {
  let deRegister = [];
  return {
    beforeDestroy() {
      deRegister.forEach((fn) => fn());
      deRegister = [];
    },
    components: {
      'bd-board': Board(),
      'bd-button': Button(),
      'bd-next-pieces': NextPieces(),
      'bd-score': Score(),
    },
    computed: {
      board() {
        return recomputeBoard(
          this.state.game.buffer, this.state.game.config.width
        );
      },
      styles() {
        return {
          flexDirection: this.state.game.currentGameViewportDimensions
            .direction,
        };
      },
      subStyles() {
        return {
          minWidth: this.state.game.currentGameViewportDimensions.x + 'px',
          minHeight: this.state.game.currentGameViewportDimensions.y + 'px',
          maxWidth: this.state.game.currentGameViewportDimensions.x + 'px',
          maxHeight: this.state.game.currentGameViewportDimensions.y + 'px',
        };
      },
    },
    mounted() {
      const controls = this.gameControls();
      this.resizer.resize();
      deRegister.push(this.resizer.bind());
      deRegister.push(registerKeyControls({
        37: controls.moveLeft,
        38: controls.moveUp,
        39: controls.moveRight,
        40: controls.moveDown,
        81: controls.rotateLeft,
        87: controls.rotateRight,
      }, (e) => this.dispatch(keyPress(e))));
    },
    props: {
      dispatch: {
        required: true,
        type: Function,
      },
      done: {
        required: true,
        type: Function,
      },
      gameControls: {
        required: true,
        type: Function,
      },
      pause: {
        required: true,
        type: Function,
      },
      resizer: {
        required: true,
        type: Object,
      },
      resume: {
        required: true,
        type: Function,
      },
      state: {
        required: true,
        type: Object,
      },
    },
    template: `<div 
      class="${gameViewportClass}" 
      v-bind:style="styles"
    >
    <bd-board v-if="!(state.game.isPaused)"
      v-bind:board="board"
      v-bind:level="state.game.level"
      v-bind:width="state.game.config.width"
      v-bind:styles="subStyles"
    >
    </bd-board> 
    <div>
      <bd-score v-bind:score="state.game.score" />
      <bd-next-pieces
        v-if="!(state.game.isPaused)"
        v-bind:preview="state.game.preview"
      />
      <div>
        <bd-button
          v-if="state.game.isPaused" 
          value="Resume"
          v-on:click="resume">
        </bd-button>
        <bd-button
          v-if="!(state.game.isPaused)" 
          value="Pause"
          v-on:click="pause">
        </bd-button>
      </div>
      <bd-button
        value="Done"
        v-on:click="done">
      </bd-button>
    </div>
  </div>`,
  };
};
