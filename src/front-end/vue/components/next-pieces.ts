import { NextPiecesBlock } from './next-pieces-block';

export const NextPieces = () => ({
  components: {
    'bd-block': NextPiecesBlock(), 
  },
  props: {
    preview: {
      required: true,
      type: Array,
    },
  },
  template: `
  <div class="ba bw2 b--vue-green mb4 shadow-vue-green">
    <h3 class="black bg-vue-green f3 mb0 mt0 tc">NEXT</h3>
    <div class="ph3 pv3">
      <div
        v-for="(block, i) in preview"
        v-bind:class="{ mb3: i < (preview.length - 1) }"
        v-bind:key="i"
      >
        <bd-block
          v-bind:block="block"
        />
        <div class="bb bw1 mt3"
          v-if="i === 0"></div>
      </div>
    </div>
  </div>
  `,
});
