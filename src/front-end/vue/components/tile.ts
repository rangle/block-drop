import {
  emptyTile,
  tileByNumber,
} from '../../styles';

export const Tile = () => ({
  computed: {
    tile() {
      return this.value === 0 ? emptyTile : tileByNumber(this.value);
    },
  },
  props: {
    value: {
      type: Number,
      required: true,
    },
  },
  template: `<div v-bind:class="tile"></div>`,
});
