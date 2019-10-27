import { h } from 'preact';
import { useReducer } from 'preact/hooks';
import { Translation } from '../interfaces';
import { state } from '../components/state';

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

function EditorBase(props: { translation: Translation }) {
  const [value, dispatch] = useReducer(reducer, initialState);
  const label = getLabel(props, value);

  return <button onClick={ () => dispatch(undefined) }>{ label }</button>
}

export const Editor = state(EditorBase);
