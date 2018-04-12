import { board, flexGrowRow } from '../../styles';
import { Tile } from './tile';

export const Board = () => ({
  components: { 'bd-tile': Tile() },
  props: {
    board: { required: true, type: Array },
    level: { required: true, type: Number },
    styles: Object,
  },
  template: `
    <div 
      class="ba bw2 b--vue-green mr2 mr4-ns flex flex-column shadow-vue-green"
    >
      <h3 class="blue-black bg-vue-green f4 f2-m f1-l ma0 pt1 pt2-m pt3-l tc">
        LEVEL {{level}}
      </h3>
      <div class="${board}">
        <div class="${flexGrowRow}" v-for="(row, i) in board" v-bind:key="i">
          <bd-tile v-for="(tile, j) in row" v-bind:value="tile" v-bind:key="j">
          </bd-tile>
        </div>
      </div>
    </div>
  `,
});
