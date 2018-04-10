import { EngineStore } from '../store/store';
import { Resizer } from '../aspect-resizer';
import '../../license';
import { routes } from './routes';
import Vue from 'vue';

const VUE = 'bd-root-vue';
const APP_ROOT_ID = 'vue-app-root';
let appRef;

export function mount(store: EngineStore, resizer: Resizer) {
  if (appRef) {
    return;
  }
  const id =
    'rando-' +
    Date.now().toString(32) +
    Math.floor(Math.random() * 1000).toString(32);
  const el = window.document.createElement('div');
  el.id = id;
  window.document.getElementById(VUE).appendChild(el);

  const data = {
    currentRoute: window.location.pathname,
    routes: routes(),
    state: store.getState(),
  };

  appRef = new Vue({
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
      return h(
        'div',
        {
          class: 'flex pa2 pa4-ns flex-auto',
          attrs: { id: APP_ROOT_ID },
        },
        [
          /** @todo determine why computed props are not in the generic --v */
          h(routeTo, {
            props: {
              createGame: store.game.create,
              dispatch: store.dispatch.bind(store),
              done: store.game.stop.bind(store.game),
              gameControls: store.game.controls.bind(store.game),
              pause: store.game.pause,
              resizer,
              resume: store.game.resume,
              start: store.game.start.bind(store.game),
              state: this.state,
            },
          }),
        ],
      );
    },
  }).$mount('#' + id);

  store.subscribe(() => {
    data.state = store.getState();
  });
}

export function unmount() {
  if (!appRef) {
    return;
  }
  appRef.$destroy();
  const el = window.document.getElementById(APP_ROOT_ID);
  el.remove();
  appRef = null;
}
