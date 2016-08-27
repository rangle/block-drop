import { mount } from './react';
import { create } from '../store/store';
import { root } from '../reducers/root.reducer.react';
import { init } from '../aspect-resizer';

const store = create(root);

mount(store, init(store));
