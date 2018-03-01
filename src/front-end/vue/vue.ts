import { partial } from '../../util';
import { EngineStore } from '../store/store';
import { Resizer } from '../aspect-resizer';
import '../../license';
// Global styles
import '../styles/index.css';

const Vue = require('vue') as any;

const VUE = 'bd-root-vue';

export function mount(store: EngineStore, resizer: Resizer) {
  const el = document.getElementById(VUE);
  el.innerHTML = '{{ app }}';
  const app = new Vue({
    el: '#' + VUE,
    data: {
      app: ' F T W ',
    },
  })
}

export function unmount() {
  const el = window.document.getElementById(VUE);
  if (el) {
    el.innerHTML = '';
  }
}
