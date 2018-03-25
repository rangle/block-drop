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
  <div class="ba bw2 b--vue-green mb4 shadow-vue-green">
    <h4 class="black bg-vue-green f3 mb0 mt0 tc">NEXT</h4>
    <div class="ph3 pv3">
      <bd-block 
        v-for="(block, i) in preview" 
        v-bind:block="block"
        v-bind:key="i"
      />
    </div>
  </div>
  `,
});
