import { useCallback, useEffect, useState } from 'react';

/**
 * "Add to home screen", for people who will not find a URL twice.
 *
 * A vendor who opens this in a browser tab during a demo has no way back to it
 * tomorrow. Installing turns it into an icon next to WhatsApp, which is the
 * difference between a tool and a link someone saw once.
 *
 * Two browser realities shape this:
 *
 *  - Chrome fires `beforeinstallprompt` once, early, often before React has
 *    mounted. Missing it means the button can never appear, so the event is
 *    captured at module load and replayed to whoever asks later.
 *  - iOS Safari never fires it at all and has no programmatic install. There
 *    the only honest thing is to describe the Share → Add to Home Screen steps,
 *    which is why `platform` is reported rather than just a boolean.
 */

let deferredPrompt = null;
const subscribers = new Set();

const publish = () => subscribers.forEach((notify) => notify(deferredPrompt));

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    // Without this Chrome shows its own mini-infobar, and the app loses the
    // ability to ask at a moment that makes sense.
    event.preventDefault();
    deferredPrompt = event;
    publish();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    publish();
  });
}

const isStandalone = () => {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    // iOS Safari's own, non-standard flag.
    window.navigator.standalone === true
  );
};

const detectPlatform = () => {
  if (typeof navigator === 'undefined') return 'other';
  const ua = navigator.userAgent;
  // iPadOS 13+ reports itself as a Mac; the touch-point count gives it away.
  const iOS = /iPad|iPhone|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
  return iOS ? 'ios' : 'other';
};

export const useInstallPrompt = () => {
  const [prompt, setPrompt] = useState(deferredPrompt);
  const [installed, setInstalled] = useState(isStandalone);
  const [platform] = useState(detectPlatform);

  useEffect(() => {
    const notify = (event) => {
      setPrompt(event);
      if (!event) setInstalled(isStandalone());
    };
    subscribers.add(notify);
    return () => subscribers.delete(notify);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return undefined;
    const query = window.matchMedia('(display-mode: standalone)');
    const onChange = () => setInstalled(isStandalone());
    query.addEventListener('change', onChange);
    return () => query.removeEventListener('change', onChange);
  }, []);

  const install = useCallback(async () => {
    if (!deferredPrompt) return 'unavailable';
    const event = deferredPrompt;
    // The event is single-use — Chrome rejects a second prompt() on it.
    deferredPrompt = null;
    publish();

    try {
      await event.prompt();
      const { outcome } = await event.userChoice;
      if (outcome === 'accepted') setInstalled(true);
      return outcome;
    } catch {
      return 'dismissed';
    }
  }, []);

  return {
    /** True when the browser is ready to install right now. */
    canInstall: !!prompt && !installed,
    /** Already running from the home screen. */
    installed,
    /** 'ios' means: no programmatic install, show the manual steps. */
    platform,
    install,
  };
};

export default useInstallPrompt;
