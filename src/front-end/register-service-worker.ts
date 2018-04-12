/* tslint:disable:no-console */

if (
  'serviceWorker' in window.navigator &&
  window.location.protocol === 'https:'
) {
  window.addEventListener('load', function() {
    window.navigator.serviceWorker
      .register('/service-worker.js')
      .then(registration => {
        console.info(
          'block-drop: serviceWorker registration successful with scope:',
          registration.scope,
        );
      })
      .catch(err => {
        console.warn('block-drop: service worker registration failed:', err);
      });
  });
}
