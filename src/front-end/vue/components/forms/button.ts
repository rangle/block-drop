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
  template: `<input type="button" 
                    v-model="value" 
                    v-on:click="onClick" 
                    class="mh1 mh2-ns pa1 ph3-ns h2-5 h3-m h3-5-l ttu vue-green shadow-vue-green br3 br4-ns bg-transparent b--vue-green bw1 bw2-m bw3-l"/>`,
});
