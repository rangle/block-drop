import {
  flexCol,
  flexGrowShrink,
  flexRow,
  flexShrink,
  gameViewportClass,
  previewDebug,
} from '../../styles';
import { recomputeBoard, noop } from '../../../util';
import { Board } from '../components';

export const Game = () => {
  let umount = noop;
  return {
    beforeDestroy() {
      umount();
    },
    components: {
      'bd-board': Board(),
    },
    computed: {
      board() {
        return recomputeBoard(
          this.state.game.buffer, this.state.game.config.width
        );
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
      resizer: {
        required: true,
        type: Object,
      },
      state: {
        required: true,
        type: Object,
      },
    },
    template: `<div class="${gameViewportClass}">
    <bd-board v-if="!(state.game.isPaused)"
    v-bind:board="board"
    v-bind:width="state.game.config.width"
    v-bind:styles="subStyles"
    ></bd-board> 
  </div>`,
  };
};
