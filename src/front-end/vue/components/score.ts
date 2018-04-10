export const Score = () => ({
  props: { score: { required: true, type: Number } },
  template: `
  <div 
    class="blue-black bg-vue-green flex 
      items-end mb2 mb4-ns ph2 ph3-ns pv1 shadow-vue-green"
  >
    <div class="f6 f4-ns calibre-light mr2 mr3-ns mb2-ns">SCORE</div>
    <div class="f3 f2-m f1-l mt1 mt2-m mt3-l">{{ score }}</div>
  </div>
  `,
});
