import { mount } from './angular';
import { create, EngineStore } from '../store/store';
import { root } from '../reducers/root.reducer.angular';
import { init } from '../aspect-resizer';

const store: EngineStore = create(root) as EngineStore;

mount(store, init(store));
