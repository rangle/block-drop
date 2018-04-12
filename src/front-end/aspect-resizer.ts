/**
 * Stateful body re-sizer to preserve board aspect ratio
 */
import { viewportResize } from './actions/events.actions';
import { computeAspectRatioDimensions, throttle } from '../util';
import { FRAMEWORK_DESCRIPTIONS } from './constants';
/**
 *
 *
 *
 *
 *
 *
 *
 *
 * Really messy file, beware.  Will need ongoing re-writing
 *
 *
 *
 *
 *
 *
 *
 *
 *
 *
 */
export interface Resizer {
  bind(): () => void;
  resize(): void;
}

let lastContainer;
let lastWidth = 0;
let lastHeight = 0;

export function init(store): Resizer {
  const throttledResize = throttle<() => void>(30, resize);

  store.subscribe(() => {
    const currentConfig = store.getState().game.config;
    if (currentConfig.width !== lastWidth) {
      resize();
      return;
    }
    if (currentConfig.height !== lastHeight) {
      resize();
      return;
    }
  });

  // call viewportResize on init
  resize();

  /** note this is currently SUPER HACKY */
  function resize() {
    const state = store.getState();
    const gameState = state.game;
    const appState = state.app;
    const currentFw = appState.currentFramework;

    if (currentFw < 0) {
      return;
    }

    lastWidth = gameState.config.width;
    lastHeight = gameState.config.height;

    const containerId = FRAMEWORK_DESCRIPTIONS[currentFw].id;

    let elAppContainer;

    if (lastContainer && lastContainer.id === containerId) {
      elAppContainer = lastContainer;
    } else {
      elAppContainer = document.getElementById(containerId);
    }

    if (!elAppContainer) {
      return throttledResize();
    }

    const viewX = Math.max(
      window.innerWidth,
      document.body.offsetWidth,
      document.documentElement.clientWidth,
      document.documentElement.offsetWidth,
    );
    const viewY = Math.max(
      window.innerHeight,
      document.body.offsetHeight,
      document.documentElement.clientHeight,
      document.documentElement.offsetHeight,
    );

    const gameX = gameState.config.width - Math.abs(gameState.trimCols);
    const gameY = gameState.config.height - Math.abs(gameState.trimRows);

    const computed = computeAspectRatioDimensions(viewX, viewY, gameX, gameY);

    // portrait
    if (viewY > viewX) {
      const limits = appState.boardPortraitLimits;
      // portrait game
      if (gameY > gameX) {
        if (limits.y) {
          computed.y -= computed.y * limits.y;
          computed.x -= computed.x * limits.y;
        }
        (<any>computed).direction = 'row';
      }
      // landscape game
      if (gameX >= gameY) {
        if (limits.x) {
          computed.y -= computed.y * limits.x;
          computed.x -= computed.x * limits.x;
        }
        (<any>computed).direction = 'row';
      }
    }

    // landscape
    if (viewX >= viewY) {
      const limits = appState.boardLandscapeLimits;
      // portrait game
      if (gameY > gameX) {
        if (limits.y) {
          computed.y -= computed.y * limits.y;
          computed.x -= computed.x * limits.y;
        }
        (<any>computed).direction = 'row';
      }
      // landscape game
      if (gameX >= gameY) {
        if (limits.x) {
          computed.y -= computed.y * limits.x;
          computed.x -= computed.x * limits.x;
        }
        (<any>computed).direction = 'row';
      }
    }

    /** why are the typings weird :/ ? */
    (<any>store).dispatch(viewportResize(computed));
  }

  return {
    bind: function bindResizeToWindow() {
      window.addEventListener('resize', throttledResize);

      return () => {
        window.removeEventListener('resize', throttledResize);
      };
    },
    resize,
  };
}
