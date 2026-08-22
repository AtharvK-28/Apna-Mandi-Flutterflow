import React, { useEffect, useState } from 'react';
import Icon from '../AppIcon';
import useNetworkStatus from '../../hooks/useNetworkStatus';
import { registerServiceWorker } from '../../utils/serviceWorker';

/**
 * One place for the two things the app needs to say about itself: that the
 * network is gone, and that a newer version is waiting.
 *
 * They share this slot rather than each owning a banner, because they can
 * happen at once and two stacked bars over a cart button is worse than either
 * problem. Offline wins — it is the one that changes what a person can do.
 *
 * It sits bottom-left so it clears the floating cart button at bottom-right,
 * and it is announced politely so a screen reader mentions it at the next
 * pause instead of interrupting mid-sentence.
 */
const ConnectionStatus = () => {
  const { offline, justReconnected } = useNetworkStatus();
  const [activateUpdate, setActivateUpdate] = useState(null);

  useEffect(
    () =>
      registerServiceWorker({
        // Stored as a function *inside* a function: passing `activate` straight
        // to setState would call it, immediately reloading the page.
        onUpdateReady: (activate) => setActivateUpdate(() => activate),
      }),
    [],
  );

  const state = offline
    ? {
        key: 'offline',
        icon: 'CloudOff',
        tint: 'bg-ink text-paper-light',
        message: 'No connection',
        detail: 'Pages you have opened still work. Sending needs signal.',
      }
    : justReconnected
      ? {
          key: 'online',
          icon: 'Wifi',
          tint: 'bg-leaf text-white',
          message: 'Back online',
          detail: null,
        }
      : activateUpdate
        ? {
            key: 'update',
            icon: 'ArrowDownCircle',
            tint: 'bg-terracotta text-white',
            message: 'A new version is ready',
            detail: null,
            action: { label: 'Refresh', onClick: activateUpdate },
          }
        : null;

  if (!state) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-4 z-40 max-w-[calc(100%-6.5rem)] sm:max-w-sm animate-slide-down"
    >
      <div
        className={`${state.tint} rounded-2xl shadow-xl px-4 py-3 flex items-start gap-2.5 font-body`}
      >
        <Icon name={state.icon} size={17} className="flex-shrink-0 mt-0.5" />
        <div className="min-w-0">
          <p className="text-sm font-bold leading-tight">{state.message}</p>
          {state.detail && (
            <p className="text-xs opacity-80 leading-snug mt-0.5">{state.detail}</p>
          )}
        </div>
        {state.action && (
          <button
            type="button"
            onClick={state.action.onClick}
            className="press ml-1 flex-shrink-0 rounded-xl bg-white/20 hover:bg-white/30 px-3 py-1.5 text-xs font-extrabold transition-colors"
          >
            {state.action.label}
          </button>
        )}
      </div>
    </div>
  );
};

export default ConnectionStatus;
