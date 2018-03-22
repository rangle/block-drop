import { flexGrowShrink, flexCol } from '../../styles';
import { Block } from './block';

export const NextPieces = () => ({
  components: {
    'bd-block': Block(), 
  },
  props: {
    preview: {
      required: true,
      type: Array,
    },
  },
  template: `
  <div class="${flexGrowShrink} ${flexCol}">
    <h3>Next:</h3>
    <bd-block 
      v-for="(block, i) in preview" 
      v-bind:block="block"
      v-bind:key="i"
    >
    </bd-block>
  </div>
  `,
});
