import { useEffect, useRef, useState } from 'react';

/**
 * Whether the device currently has a network connection.
 *
 * `navigator.onLine` is a weaker signal than it looks: it reports whether the
 * device has *an interface up*, not whether anything is reachable. A phone on a
 * captive-portal Wi-Fi, or holding one bar of 2G that times out on every
 * request, still reports `true`. So this is treated as "definitely offline"
 * when false and only "probably online" when true — the UI states that limit
 * rather than claiming certainty.
 *
 * `justReconnected` stays true briefly after coming back, which is what lets a
 * banner say "back online" and then get out of the way, instead of vanishing
 * silently and leaving someone unsure whether it is safe to retry.
 */

const RECONNECT_NOTICE_MS = 4000;

const readOnline = () =>
  typeof navigator === 'undefined' || typeof navigator.onLine !== 'boolean'
    ? true
    : navigator.onLine;

export const useNetworkStatus = () => {
  const [online, setOnline] = useState(readOnline);
  const [justReconnected, setJustReconnected] = useState(false);

  // Mirrors `online` so the listeners can read the previous value without
  // being torn down and re-attached on every change.
  const onlineRef = useRef(online);
  onlineRef.current = online;

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    let timer;

    const handleOnline = () => {
      const wasOffline = !onlineRef.current;
      onlineRef.current = true;
      setOnline(true);

      // Only worth announcing a reconnection if we were actually away.
      if (!wasOffline) return;
      setJustReconnected(true);
      clearTimeout(timer);
      timer = setTimeout(() => setJustReconnected(false), RECONNECT_NOTICE_MS);
    };

    const handleOffline = () => {
      clearTimeout(timer);
      onlineRef.current = false;
      setJustReconnected(false);
      setOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // The connection can change between the first render and this effect
    // attaching, and that event would otherwise be missed entirely.
    if (readOnline() !== onlineRef.current) {
      if (readOnline()) handleOnline();
      else handleOffline();
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { online, offline: !online, justReconnected };
};

export default useNetworkStatus;
