import { identity } from '../../../../util';

export const InputString = () => ({
  data: () => ({
    inputValue: '',
  }),
  mounted() {
    this.inputValue = this.value;
  },
  props: {
    sanitizer: {
      default: identity,
      type: Function,
    },
    value: String,
  },
  template: `
    <input 
      type="string" 
      v-model="inputValue"
    >
  `,
  watch: {
    inputValue() {
      const val = this.sanitizer(this.inputValue);
      this.$emit('change', val);
    },
    value(newVal: number | string) {
      this.inputValue = newVal;
    },
  },
});
