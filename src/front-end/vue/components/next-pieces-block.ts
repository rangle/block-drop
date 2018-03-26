import { Tile } from './tile';
import { columnsFromBlock } from '../../../engine/block';

export const NextPiecesBlock = () => ({
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
  <div>
    <div class="flex justify-center"
      v-for="(row, i) in cols"
      v-bind:key="i"
    >
      <div class="flex h2 w2"
        v-bind:class="{ mr2: j < (row.length - 1) }"
        v-for="(tile, j) in row"
        v-bind:key="j"
      >
        <bd-tile 
          v-bind:value="tile"
        >
        </bd-tile>
      </div>
    </div>
  </div>
  `,
});
