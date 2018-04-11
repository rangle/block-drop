import { registerKeyControls } from '../../controls';
import { keyPress } from '../../actions/events.actions';
import { recomputeBoard } from '../../../util';
import { Board, Button, NextPieces, Score } from '../components';

export const Game = () => {
  let deRegister = [];
  return {
    beforeDestroy() {
      deRegister.forEach(fn => fn());
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
          this.state.game.buffer,
          this.state.game.config.width,
        );
      },
    },
    mounted() {
      const controls = this.gameControls();
      this.resizer.resize();
      deRegister.push(this.resizer.bind());
      deRegister.push(
        registerKeyControls(
          {
            37: controls.moveLeft,
            38: controls.moveUp,
            39: controls.moveRight,
            40: controls.moveDown,
            81: controls.rotateLeft,
            87: controls.rotateRight,
          },
          e => this.dispatch(keyPress(e)),
        ),
      );
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
    template: `
      <div 
        class="flex flex-auto" 
      >
        <bd-board
          class="w-two-thirds"
          v-if="!(state.game.isPaused)"
          :board="board"
          :level="state.game.level"
          :width="state.game.config.width"
        >
        </bd-board> 
        <div class="w-third">
          <bd-score :score="state.game.score" />
          <bd-next-pieces
            v-if="!(state.game.isPaused)"
            :preview="state.game.preview"
          />
          <div class="flex flex-wrap justify-between man1 man2-ns">
            <bd-button 
              class="flex-auto ma1 ma2-ns"
              v-if="state.game.isPaused" 
              value="Resume"
              @click="resume">
            </bd-button>
            <bd-button 
              class="flex-auto ma1 ma2-ns"
              v-if="!(state.game.isPaused)" 
              value="Pause"
              @click="pause">
            </bd-button>
            <bd-button 
              class="flex-auto ma1 ma2-ns"
              value="Done"
              @click="done">
            </bd-button>
          </div>
        </div>
      </div>
    `,
  };
};
