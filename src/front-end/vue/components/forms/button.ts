export const Button = () => ({
  methods: {
    onClick() {
      this.$emit('click');
    },
  },
  props: {
    value: {
      required: true,
      type: String,
    },
  },
  template: `<input type="button" 
                    v-model="value" 
                    v-on:click="onClick" 
                    class="pa1 pa3-ns ttu vue-green shadow-vue-green br3 br4-ns bg-transparent b--vue-green bw1 bw2-m bw3-l"/>`,
});
