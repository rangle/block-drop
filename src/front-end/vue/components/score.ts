export const Score = () => ({
  props: {
    score: {
      required: true,
      type: Number,
    },
  },
  template: `
  <div class="black bg-vue-green flex items-end mb4 ph3 pv1 shadow-vue-green">
    <div class="f6 fw3 mr2">SCORE</div>
    <div class="f2">{{ score }}</div>
  </div>
  `,
});
