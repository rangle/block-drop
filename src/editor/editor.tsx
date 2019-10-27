import { h } from 'preact';
import { useReducer, useState } from 'preact/hooks';
import { Translation, UiToGameState, Matrix3_1 } from '../interfaces';
import { state } from '../components/state';
import { Cameras } from '../components/cameras';

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
  const [value, dispatch] = useReducer(reducer, initialState);
  const label = getLabel(props, value);
  const utg = props.uiToGameState;
  const [cameraPosition, setCameraPosition] = useState([1, 2, 3]);

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
    </div>
  ) : (
    <button onClick={() => dispatch(undefined)}>{label}</button>
  );
}

export const Editor = state(EditorBase);
