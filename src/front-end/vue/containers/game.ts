import {
  gameViewportClass,
  previewDebug,
} from '../../styles';
import { recomputeBoard, noop } from '../../../util';
import { Board, Button, Debug, NextPieces } from '../components';
import { columnsFromBlock } from '../../../engine/block';

export const Game = () => {
  let umount = noop;
  return {
    beforeDestroy() {
      umount();
    },
    components: {
      'bd-board': Board(),
      'bd-button': Button(),
      'bd-debug': Debug(),
      'bd-next-pieces': NextPieces(),
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
      this.resizer.resize();
      umount = this.resizer.bind();
    },
    props: {
      dispatch: {
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
      v-bind:width="state.game.config.width"
      v-bind:styles="subStyles"
    ></bd-board> 
    <div class="${previewDebug}">
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
      <bd-next-pieces 
        v-if="!(state.game.isPaused)"
        v-bind:preview="state.game.preview">
      </bd-next-pieces>
      <bd-debug 
        v-bind:keyCode="state.game.lastEvent.keyCode"
        v-bind:activePiece="state.game.activePiece"
      >
      </bd-debug>
    </div>
  </div>`,
  };
};
