import { InputDevice } from './input-device';
import { O_EMPTY_BLOCK } from '../../constants';
import { ActivePiece } from './active-piece';
import { flexGrowShrink } from '../../styles';

export const Debug = () => ({
  components: {
    'bd-active-piece': ActivePiece(),
    'bd-input-device': InputDevice(),
  },
  methods: {
    stringify: JSON.stringify.bind(JSON),
  },
  props: {
    activePiece: {
      required: true,
      type: Object,
    },
    keyCode: {
      required: true,
      type: Number,
    },
  },
  template: `
  <div class=${ flexGrowShrink }>
    <bd-input-device 
      v-bind:lastKeyCode="keyCode"> 
    </bd-input-device>
    <bd-active-piece 
      v-bind:centreX="activePiece.centreX"
      v-bind:centreY="activePiece.centreY"
      v-bind:desc="stringify(activePiece.desc, null, 2)"
      v-bind:height="activePiece.height"
      v-bind:name="activePiece.name"
      v-bind:width="activePiece.width"
      v-bind:x="activePiece.x"
      v-bind:y="activePiece.y">
    </bd-active-piece>
  </div>
  `,
});
