import { partial } from '../../util';
import { EngineStore } from '../store/store';
import { Resizer } from '../aspect-resizer';
import '../../license';
import { routes } from './routes';
import { verticalUiClass, } from '../styles';
import { Nav } from './components';
import { VUE_LOCATION_CHANGE } from './router-reducer';
// Global styles
import '../styles/index.css';

const Vue = require('vue') as any;
const VUE = 'bd-root-vue';

export function mount(store: EngineStore, resizer: Resizer) {
  const id = 'rando-' + Date.now().toString(32) + 
    Math.floor(Math.random() * 1000).toString(32);
  const el = window.document.createElement('div');
  el.id = id;
  window.document.getElementById(VUE).appendChild(el);

  const data = {
    currentRoute: window.location.pathname,
    routes: routes(),
    state: store.getState(),
  };

  const nav = Nav();

  const app = new Vue({
    data,
    methods: {
      redraw() {
        this.$forceUpdate();
      },
      resize() {
        resizer.resize();
      },
    },
    render(h) {
      const currentRoute = window.location.pathname;
      const route = this.routes[currentRoute];
      const routeTo = route ? route.component : this.routes['/game'].component;
      /** @todo determine why computed props are not in the generic --v */
      const redraw = (this as any).redraw.bind(this);
      return h(
        'div',
        {
          class: {
            [verticalUiClass]: true,
          },
        },
        [
          h(nav, {
            on: {
              nav(path: string) {
                store.dispatch({ type: VUE_LOCATION_CHANGE, payload: path });
                window.history.pushState(null, name, '/' + path);
                redraw();
              },
            },
            props: {
              routes: this.state.app.routes,
            }
          }),
          /** @todo determine why computed props are not in the generic --v */
          h(routeTo, {
            // class: {
            //   'svb-main': true,
            // },
            props: { resizer, state: this.state },
          }),
        ],
      );
    },
  }).$mount('#' + id);

  store.subscribe(() => {
    data.state = store.getState();
    // (data.state as any).routing = state.app;
    // (data.state as any).routing = state.game;
    // (data.state as any).routing = state.nextConfig;
    // (data.state as any).routing = (state as any).routing;
  });
}

export function unmount() {
  const el = window.document.getElementById(VUE);
  el.innerHTML = '';
}
