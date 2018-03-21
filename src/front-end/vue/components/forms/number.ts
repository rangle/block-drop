import {
  clamp,
} from '../../../../util';

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
    inputValue(newVal: number, oldVal: number) {
      const val = clamp(this.inputValue, this.min, this.max);
      this.$emit('change', val);
    },
    value(newVal: number, oldVal: number) {
      this.inputValue = newVal;
    },
  },
});
