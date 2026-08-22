/* eslint-env serviceworker */

/**
 * Offline support.
 *
 * This app's users are street food vendors, karigars and small wholesalers.
 * They open it standing in a market on a phone with one bar of signal, and the
 * network drops constantly. Without a service worker that means the browser's
 * dinosaur page — the whole app gone because a single request timed out.
 *
 * The goal here is modest and deliberately so: the app should always *open*,
 * and anything already seen should still be readable. It is not an offline-
 * first data layer — there is no backend in this repo to sync against — so no
 * promise is made about writes. The UI says plainly when it is offline rather
 * than pretending an action succeeded.
 *
 * Bump CACHE_VERSION whenever the caching rules change; the activate handler
 * deletes every cache that does not match, which is what keeps a stale shell
 * from surviving a deploy.
 */

const CACHE_VERSION = 'v1';
const SHELL_CACHE = `apna-mandi-shell-${CACHE_VERSION}`;
const ASSET_CACHE = `apna-mandi-assets-${CACHE_VERSION}`;
const IMAGE_CACHE = `apna-mandi-images-${CACHE_VERSION}`;
const CURRENT = [SHELL_CACHE, ASSET_CACHE, IMAGE_CACHE];

const OFFLINE_URL = '/offline.html';

// The shell is every route, because this is a single-page app: '/' returns the
// same HTML for /deals and /karigar/earnings alike.
const SHELL_URLS = [
  '/',
  OFFLINE_URL,
  '/manifest.json',
  '/icon.svg',
  '/icon-192.png',
];

// Only these cross-origin hosts are cached. Everything else third-party is left
// to the network, so nothing is quietly persisted that the app did not ask for.
const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

// A phone with 500 photos of onions cached is a phone with no storage left.
const IMAGE_CACHE_LIMIT = 60;

const trimCache = async (cacheName, limit) => {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  // Oldest first: Cache.keys() preserves insertion order.
  await Promise.all(keys.slice(0, Math.max(0, keys.length - limit)).map((key) => cache.delete(key)));
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(SHELL_CACHE).then((cache) =>
      // addAll rejects the whole install if any single URL 404s, which would
      // leave the app with no worker at all. Failures are tolerated per-URL.
      Promise.all(
        SHELL_URLS.map((url) =>
          cache.add(new Request(url, { cache: 'reload' })).catch(() => undefined),
        ),
      ),
    ),
  );
  // Deliberately no skipWaiting() here: replacing the worker mid-session can
  // swap the assets out from under a page that is already running. The new
  // worker waits until the UI offers a refresh (see the SKIP_WAITING message).
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names.filter((name) => !CURRENT.includes(name)).map((name) => caches.delete(name)),
      );
      // Serve pages that were loaded before this worker existed.
      await self.clients.claim();
    })(),
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

/** Network first, falling back to whatever was cached, then the offline page. */
const handleNavigation = async (request) => {
  const cache = await caches.open(SHELL_CACHE);
  try {
    const response = await fetch(request);
    // Store the shell under '/' rather than the requested path: every route
    // returns identical HTML, so one entry serves them all.
    if (response.ok) cache.put('/', response.clone());
    return response;
  } catch {
    return (await cache.match('/')) ?? (await cache.match(OFFLINE_URL)) ?? Response.error();
  }
};

/** Cache first — for content-hashed build output, which never changes. */
const handleImmutable = async (request, cacheName) => {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  if (response.ok || response.type === 'opaque') cache.put(request, response.clone());
  return response;
};

/** Serve the cached copy at once, refresh it in the background. */
const handleRevalidating = async (request, cacheName) => {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);

  const network = fetch(request)
    .then((response) => {
      if (response.ok || response.type === 'opaque') cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached);

  return cached ?? network;
};

self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Never interfere with anything that changes state on the server.
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;

  if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(request));
    return;
  }

  if (sameOrigin && url.pathname.startsWith('/assets/')) {
    // Vite fingerprints these filenames, so a cached copy can never be stale.
    event.respondWith(handleImmutable(request, ASSET_CACHE));
    return;
  }

  if (sameOrigin && request.destination === 'image') {
    event.respondWith(
      handleImmutable(request, IMAGE_CACHE).then((response) => {
        event.waitUntil(trimCache(IMAGE_CACHE, IMAGE_CACHE_LIMIT));
        return response;
      }),
    );
    return;
  }

  if (FONT_HOSTS.includes(url.hostname)) {
    event.respondWith(handleRevalidating(request, ASSET_CACHE));
    return;
  }

  if (sameOrigin) {
    event.respondWith(handleRevalidating(request, SHELL_CACHE));
  }
  // Anything else (a third-party API, an external image host) goes straight to
  // the network untouched.
});
