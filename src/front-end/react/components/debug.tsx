import * as React from 'react';
import { InputDevice } from './input-device';
import { ActivePiece } from './active-piece';
import { flexGrowShrink } from '../../styles';

export function Debug({ activePiece, lastEvent }) {
  return (
  <div className={ flexGrowShrink }>
    <InputDevice lastKeyCode={ lastEvent.keyCode } />
    <ActivePiece p={ activePiece() } />
  </div>);
}
