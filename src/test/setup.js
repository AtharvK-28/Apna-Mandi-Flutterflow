import '@testing-library/jest-dom/vitest';
// Vitest runs in jsdom, which has no real localStorage in some environments and
// carries state between tests in others. A fresh in-memory implementation per
// test file keeps AuthContext's persistence tests independent of each other.
import { afterEach, beforeEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

const createStorage = () => {
  let store = {};
  return {
    getItem: (key) => (key in store ? store[key] : null),
    setItem: (key, value) => {
      store[key] = String(value);
    },
    removeItem: (key) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key: (index) => Object.keys(store)[index] ?? null,
  };
};

beforeEach(() => {
  Object.defineProperty(globalThis, 'localStorage', {
    value: createStorage(),
    configurable: true,
    writable: true,
  });
  vi.restoreAllMocks();
});

afterEach(() => {
  cleanup();
});
