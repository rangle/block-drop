import { mount } from './react';
import { create, EngineStore } from '../store/store';
import { root } from '../reducers/root.reducer.react';
import { init } from '../aspect-resizer';

const store = create(root) as EngineStore;

mount(store, init(store));
