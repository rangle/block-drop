self.addEventListener('install', (event) => {
  // Perform install steps
});

const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
  '/',
  '/styles.css',
  '/assets/fonts/Calibre-Light.otf',
  '/assets/fonts/Calibre-Medium.otf',
  '/assets/fonts/Calibre-Regular.otf',
  '/assets/fonts/Calibre-Thin.otf',
  '/assets/angular-logo.svg',
  '/assets/pause.svg',
  '/assets/rangle-logo.png',
  '/assets/rangle-logo.svg',
  '/assets/react-logo.svg',
  '/assets/replay.svg',
  '/assets/vue-logo.svg',
];

self.addEventListener('install', (event: any) => {
  // Perform install steps
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log.bind(console, 'Opened cache')();
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event: any) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response;
        }

        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then(
          (res: any) => {
            // Check if we received a valid response
            if (
              !res || 
              res.status !== 200 || 
              res.type !== 'basic'
            ) {
              return res;
            }

            const responseToCache = res.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return res;
          }
        );
      }
    )
  );
});

self.addEventListener('activate', (event: any) => {
  const cacheWhitelist = ['pages-cache-v1', 'blog-posts-cache-v1'];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
