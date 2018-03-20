export const Button = () => ({
  methods: {
    onClick() {
      this.$emit('click');
    }
  },
  props: ['value'],
  template: '<input type="button" v-model="value" v-on:click="onClick" />',
});
