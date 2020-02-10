import { NextPiecesBlock } from './next-pieces-block';

export const NextPieces = () => ({
  components: { 'bd-block': NextPiecesBlock() },
  props: { preview: { required: true, type: Array } },
  template: `
  <div class="ba bw2 b--vue-green mb4 shadow-vue-green">
    <h3 class="blue-black bg-vue-green f4 f2-m f1-l ma0 pt1 pt2-m pt3-l tc">
      NEXT
    </h3>
    <div class="pa2 pa3-ns flex flex-column-reverse">
      <div
        v-for="(block, i) in preview"
        v-bind:class="{ mb3: i !== 0 }"
        v-bind:key="i"
      >
        <hr 
          class="ma0 mb3 bn shadow-vue-green bg-vue-green h0-25" 
          v-if="i === 0"/>
        <bd-block
          v-bind:block="block"
        />
      </div>
    </div>
  </div>
  `,
});
