import { nextConfigProp } from '../../actions/game.actions';
import { configInterfaces } from '../../../engine/configs/config-interfaces';
import { identity, isObject } from '../../../util';
import { Button, InputNumber, InputSelect, InputString } from '../components';

export const Config = () => ({
  components: {
    'bd-button': Button(),
    'bd-number': InputNumber(),
    'bd-select': InputSelect(),
    'bd-string': InputString(),
  },
  data() {
    return { configInterfaces };
  },
  methods: {
    identity,
    updateSelection(selection, prop) {
      let value = selection;
      if (isObject(selection)) {
        value = selection.value;
      }
      (<any>this.dispatch)(nextConfigProp(prop, value));
    },
  },
  props: {
    createGame: {
      required: true,
      type: Function,
    },
    dispatch: {
      required: true,
      type: Function,
    },
    state: {
      required: true,
      type: Object,
    },
  },
  template: `<div>
    <div v-for="i in configInterfaces">
      <strong>{{ i.label }}</strong>
      <bd-select v-if="i.type == 'select'"
        v-bind:value="state.nextConfig[i.prop]" 
        v-on:change="updateSelection($event.value, i.prop)"
        v-bind:options="i.options()"
        v-bind:byValue="true">
      </bd-select>
      <bd-number v-if="i.type == 'number'"
        v-bind:value="state.nextConfig[i.prop]"
        v-on:change="updateSelection($event, i.prop)"
        v-bind:min="state.nextConfig[i.min]"
        v-bind:max="state.nextConfig[i.max]">
      </bd-number> 
      <bd-string v-if="i.type == 'string'"
        v-bind:value="state.nextConfig[i.prop]"
        v-on:change="updateSelection($event, i.prop)"
        v-bind:sanitizer="i.sanitizer || identity">
      </bd-string> 
    </div>
    <bd-button v-on:click="createGame" value="New Game"></bd-button> 
  </div>`,
});
