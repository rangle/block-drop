import { Button } from './forms';
import { verticalUiClass, } from '../../styles';

export const Nav = () => ({
  components: {
    'bd-button': Button(),
  },
  methods: {
    onClick(path: string) {
      this.$emit('nav', path);
    },
  },
  props: ['routes'],
  template: `<div class=${verticalUiClass}>
      <bd-button v-for="route in routes"
         v-bind:key="route.id"
         v-on:click="onClick(route.path)"
         v-model="route.name">
      </bd-button>
    </div>`,
});
