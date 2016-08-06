import * as React from 'react';
import { InputDevice } from './input-device';
import { ActivePiece } from './active-piece';

export function Debug({ activePiece, lastEvent }) {
  return (
  <div className='bd-debug bd-clear bd-float'>
    <InputDevice lastKeyCode={ lastEvent.keyCode } />
    <ActivePiece p={ activePiece() } />
  </div>);
}
