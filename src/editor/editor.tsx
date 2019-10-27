import { h } from 'preact';
import { useReducer, useState } from 'preact/hooks';
import { Translation, UiToGameState, Matrix3_1 } from '../interfaces';
import { state } from '../components/state';
import { Cameras } from '../components/cameras';
import { Orientation } from '../components/orientation';

const initialState = false;

const reducer = (state: boolean) => {
  return !state;
};

function getLabel(props: { translation: Translation }, isOpen: boolean) {
  if (!props.translation.editor) {
    return '';
  }
  if (isOpen) {
    return props.translation.editor.toggleHide;
  }
  return props.translation.editor.toggleShow;
}

function EditorBase(props: {
  translation: Translation;
  uiToGameState: UiToGameState;
}) {
  const t = 'translation';
  const r = 'rotation';
  const s = 'scale';
  const [value, dispatch] = useReducer(reducer, initialState);
  const label = getLabel(props, value);
  const utg = props.uiToGameState;
  const [cameraPosition, setCameraPosition] = useState([1, 2, 3]);
  const trs = {
    translation: [1, 2, 3] as Matrix3_1,
    rotation: [0, Math.PI, -Math.PI] as Matrix3_1,
    scale: [4, 5, 6] as Matrix3_1,
  };

  utg.on('cameras', (value: Matrix3_1) => {
    setCameraPosition(value);
  });

  return value ? (
    <div>
      <button onClick={() => dispatch(undefined)}>{label}</button>
      <Cameras
        onChange={(...values: Matrix3_1[]) => utg.emit('cameras', ...values)}
        values={[cameraPosition as Matrix3_1]}
      />
      <Orientation
        label={{ t, r, s }}
        onChange={console.log.bind(console)}
        value={trs}
      />
    </div>
  ) : (
    <button onClick={() => dispatch(undefined)}>{label}</button>
  );
}

export const Editor = state(EditorBase);
