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
    styles: Object,
  },
  template: `
    <div class="${ board }" v-bind:style="styles">
      <div class="${ flexGrowRow }" v-for="(row, i) in board" v-bind:key="i">
        <bd-tile v-for="(tile, j) in row" v-bind:value="tile" v-bind:key="j">
        </bd-tile>
      </div>
    </div>
  `,
});
