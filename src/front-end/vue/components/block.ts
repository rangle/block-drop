import { Tile } from './tile';
import { flexGrowRow, flexGrowCol } from '../../styles';
import { columnsFromBlock } from '../../../engine/block';

export const Block = () => ({
  components: {
    'bd-tile': Tile(),
  },
  computed: {
    cols() {
      return columnsFromBlock(this.block);
    },
  },
  props: {
    block: {
      required: true,
      type: Object,
    },
  },
  template: `
  <div class="${flexGrowCol}">
    {{ block.name }}
    <div 
      class="${flexGrowRow}" 
      v-for="(row, i) in cols" 
      v-bind:key="i"
      >
      <bd-tile 
        v-for="(tile, j) in row" 
        v-bind:value="tile" 
        v-bind:key="j">
      </bd-tile>
    </div>
  </div>
  `,
});
