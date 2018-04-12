import { clamp } from '../../../../util';

export const InputNumber = () => ({
  data: () => ({
    inputValue: NaN,
  }),
  mounted() {
    this.inputValue = this.value;
  },
  props: {
    max: Number,
    min: Number,
    value: Number,
  },
  template: `
    <input 
      type="string" 
      v-model="inputValue"
    >
  `,
  watch: {
    inputValue() {
      const val = clamp(this.inputValue, this.min, this.max);
      this.$emit('change', val);
    },
    value(newVal: number) {
      this.inputValue = newVal;
    },
  },
});
