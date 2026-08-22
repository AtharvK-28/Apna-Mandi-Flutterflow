/**
 * Service worker registration.
 *
 * Two things this deliberately does not do:
 *
 *  - It does not register in development. A service worker caching the dev
 *    server's modules breaks hot reload in ways that look like your edits are
 *    being ignored, and costs an hour before anyone thinks to check.
 *  - It does not activate a new worker behind the user's back. Swapping the
 *    code under a running page can leave it requesting chunks that no longer
 *    exist. The new worker waits; the UI offers a refresh; `skipWaiting()`
 *    runs only once someone accepts.
 */

export const isSupported = () =>
  typeof navigator !== 'undefined' && 'serviceWorker' in navigator;

/**
 * @param onUpdateReady called with an `activate()` function when a newer
 *        version has installed and is waiting to take over.
 * @returns a cleanup function.
 */
export const registerServiceWorker = ({ onUpdateReady } = {}) => {
  if (!isSupported() || !import.meta.env.PROD) return () => {};

  let disposed = false;
  let reloading = false;

  // Fired when the waiting worker takes control. Reloading here — rather than
  // straight after postMessage — guarantees the new page is served by the new
  // worker instead of racing it.
  const onControllerChange = () => {
    if (reloading) return;
    reloading = true;
    window.location.reload();
  };

  navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

  const announce = (worker) => {
    if (disposed || !worker) return;
    onUpdateReady?.(() => worker.postMessage({ type: 'SKIP_WAITING' }));
  };

  const start = async () => {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js', { scope: '/' });
      if (disposed) return;

      // An update may already have installed during a previous visit.
      if (registration.waiting && navigator.serviceWorker.controller) {
        announce(registration.waiting);
      }

      registration.addEventListener('updatefound', () => {
        const installing = registration.installing;
        if (!installing) return;

        installing.addEventListener('statechange', () => {
          // No existing controller means this is the very first install, so
          // there is nothing to update *from* and nothing to tell the user.
          if (installing.state === 'installed' && navigator.serviceWorker.controller) {
            announce(installing);
          }
        });
      });
    } catch {
      // A failed registration costs offline support, nothing else. The app
      // works exactly as it did before; there is no user-facing error worth
      // interrupting anyone for.
    }
  };

  // Registering after load keeps the worker's install off the critical path on
  // the slow connections this whole feature exists for.
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });

  return () => {
    disposed = true;
    navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
  };
};

/** Escape hatch: removes the worker and every cache it created. */
export const unregisterServiceWorker = async () => {
  if (!isSupported()) return;
  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((registration) => registration.unregister()));
  if (typeof caches !== 'undefined') {
    const names = await caches.keys();
    await Promise.all(
      names.filter((name) => name.startsWith('apna-mandi-')).map((name) => caches.delete(name)),
    );
  }
};
