import { Button } from './forms';

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
  template: `<span><bd-button v-for="route in routes"
         key="route.id"
         v-on:click="onClick(route.path)"
         v-model="route.name"></bd-button></span>`,
});
