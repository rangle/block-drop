export const Button = () => ({
  methods: {
    onClick() {
      this.$emit('click');
    }
  },
  props: {
    value: {
      required: true,
      type: String,
    },
  },
  template: '<input type="button" v-model="value" v-on:click="onClick" />',
});
