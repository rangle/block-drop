import { 
  board, 
  flexGrowRow,
 } from '../../styles';
import { Tile } from './tile';

export const Board = () => ({
  components: {
    'bd-tile': Tile(),
  },
  props: {
    board: {
      required: true,
      type: Array,
    },
    level: {
      required: true,
      type: Number,
    },
    styles: Object,
  },
  template: `
    <div class="ba bw2 b--vue-green mr4 shadow-vue-green">
      <h3 class="black bg-vue-green f3 mb0 mt0 tc">LEVEL {{level}}</h3>
      <div class="${ board }" v-bind:style="styles">
        <div class="${ flexGrowRow }" v-for="(row, i) in board" v-bind:key="i">
          <bd-tile v-for="(tile, j) in row" v-bind:value="tile" v-bind:key="j">
          </bd-tile>
        </div>
      </div>
    </div>
  `,
});
