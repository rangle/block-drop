import { mount } from './vue';
import { create } from '../store/store';
import { root } from '../reducers/root.reducer.vue';
import { init } from '../aspect-resizer';

const store = create(root);

mount(store, init(store));
