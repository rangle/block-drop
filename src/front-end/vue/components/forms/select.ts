export const InputSelect = () => ({
  data: () => ({
    inputValue: 0,
  }),
  methods: {
    optionValue(selected: number, i: number) {
      return this.byValue ? selected : i;
    },
  },
  mounted() {
    this.inputValue = this.value;
  },
  props: {
    byValue: {
      default: false,
      type: Boolean,
    },
    options: {
      required: true,
      type: Array,
    },
    value: [Number, String],
  },
  template: `
    <select v-model="inputValue">
      <option 
        v-for="(selected, i) in options" 
        v-bind:value="optionValue(selected, i)">
          {{ selected }}
      </option> 
    </select>
  `,
  watch: {
    inputValue() {
      this.$emit('change', {
        index: this.inputValue,
        value: this.byValue ? this.inputValue : this.options[this.inputValue],
      });
    },
    value(newVal: number | string) {
      this.inputValue = newVal;
    },
  },
});
