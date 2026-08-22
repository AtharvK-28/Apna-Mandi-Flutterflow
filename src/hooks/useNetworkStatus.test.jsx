import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import useNetworkStatus from './useNetworkStatus';

/**
 * The connection banner is the one piece of UI that only ever appears when
 * something has gone wrong, which means nobody sees it during development.
 * These cover the transitions rather than the markup.
 */

const setOnLine = (value) => {
  Object.defineProperty(window.navigator, 'onLine', {
    value,
    configurable: true,
    writable: true,
  });
};

const Probe = () => {
  const { online, offline, justReconnected } = useNetworkStatus();
  return (
    <output data-testid="probe">
      {`${online ? 'online' : 'not-online'}|${offline ? 'offline' : 'not-offline'}|${
        justReconnected ? 'reconnected' : 'quiet'
      }`}
    </output>
  );
};

const state = () => screen.getByTestId('probe').textContent;

describe('useNetworkStatus', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    setOnLine(true);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts from navigator.onLine', () => {
    setOnLine(false);
    render(<Probe />);
    expect(state()).toBe('not-online|offline|quiet');
  });

  it('treats a missing navigator.onLine as online rather than blocking the app', () => {
    Object.defineProperty(window.navigator, 'onLine', {
      value: undefined,
      configurable: true,
      writable: true,
    });
    render(<Probe />);
    expect(state()).toBe('online|not-offline|quiet');
  });

  it('reacts to the offline event', () => {
    render(<Probe />);
    expect(state()).toBe('online|not-offline|quiet');

    act(() => {
      setOnLine(false);
      window.dispatchEvent(new Event('offline'));
    });

    expect(state()).toBe('not-online|offline|quiet');
  });

  it('announces a reconnection, then falls quiet on its own', () => {
    render(<Probe />);

    act(() => {
      setOnLine(false);
      window.dispatchEvent(new Event('offline'));
    });
    act(() => {
      setOnLine(true);
      window.dispatchEvent(new Event('online'));
    });

    expect(state()).toBe('online|not-offline|reconnected');

    act(() => vi.advanceTimersByTime(4100));
    expect(state()).toBe('online|not-offline|quiet');
  });

  it('does not announce "back online" for an online event while already online', () => {
    render(<Probe />);

    act(() => window.dispatchEvent(new Event('online')));

    expect(state()).toBe('online|not-offline|quiet');
  });

  it('catches a drop that happened between first render and the listeners attaching', () => {
    // Simulates the connection dying during the initial render: the state was
    // read as online, but by the time the effect runs the device is offline
    // and the event has already been missed.
    setOnLine(true);
    const OnceOffline = () => {
      const status = useNetworkStatus();
      // Flip the underlying value during render, before the effect subscribes.
      setOnLine(false);
      return <output data-testid="probe">{status.offline ? 'offline' : 'not-offline'}</output>;
    };

    render(<OnceOffline />);
    expect(state()).toBe('offline');
  });

  it('removes its listeners on unmount', () => {
    const remove = vi.spyOn(window, 'removeEventListener');
    const { unmount } = render(<Probe />);
    unmount();

    const removed = remove.mock.calls.map(([type]) => type);
    expect(removed).toContain('online');
    expect(removed).toContain('offline');
  });
});
