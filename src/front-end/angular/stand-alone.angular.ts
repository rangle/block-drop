import { mount } from './angular';
import { create } from '../store/store';
import { root } from '../reducers/root.reducer.angular';
import { init } from '../aspect-resizer';

const store = create(root);

mount(store, init(store));
