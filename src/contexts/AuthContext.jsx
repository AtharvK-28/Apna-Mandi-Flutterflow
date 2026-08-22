import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { GUEST, ROLE_META, can as roleCan, getHomeRoute, isRole } from '../config/roles';

// Demo session store. Auth is mocked client-side (there is no backend in this
// repo) but everything above this file treats it as a real session: components
// read `useAuth()` and never touch localStorage directly, so swapping in a real
// API means rewriting only this provider.

const STORAGE = {
  user: 'apna-mandi-user',
  session: 'apna-mandi-session',
};

// Older builds wrote `userData`/`userType` as two separate keys. Read them once
// so an existing browser session survives the upgrade, then write the new shape.
const LEGACY = { user: 'userData', type: 'userType' };

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem(STORAGE.user) ?? localStorage.getItem(LEGACY.user);
    const parsed = raw ? JSON.parse(raw) : null;
    if (!parsed || typeof parsed !== 'object') return null;

    const role = isRole(parsed.role)
      ? parsed.role
      : isRole(parsed.userType)
        ? parsed.userType
        : localStorage.getItem(LEGACY.type);

    // A stored profile without a recognised role is unusable — treat as absent
    // rather than letting an unknown role fall through the access checks.
    return isRole(role) ? { ...parsed, role } : null;
  } catch {
    return null;
  }
};

const readSessionState = () => {
  try {
    return localStorage.getItem(STORAGE.session);
  } catch {
    return null;
  }
};

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(readStoredUser);
  // 'active'  — signed in with a profile
  // 'guest'   — browsing deliberately, no account
  // null      — not signed in
  const [sessionState, setSessionState] = useState(readSessionState);

  const persist = useCallback((nextUser, nextSession) => {
    try {
      if (nextUser) {
        localStorage.setItem(STORAGE.user, JSON.stringify(nextUser));
      } else {
        localStorage.removeItem(STORAGE.user);
      }
      if (nextSession) {
        localStorage.setItem(STORAGE.session, nextSession);
      } else {
        localStorage.removeItem(STORAGE.session);
      }
      // Legacy keys are no longer read once a new-shape profile exists.
      localStorage.removeItem(LEGACY.user);
      localStorage.removeItem(LEGACY.type);
    } catch {
      // Private-mode browsers can refuse writes; the in-memory session still works.
    }
  }, []);

  // Completing registration, or an OTP login for an already-known profile.
  const signIn = useCallback(
    (role, profile = {}) => {
      if (!isRole(role)) throw new Error(`Unknown role: ${role}`);
      const nextUser = { ...profile, role };
      setUser(nextUser);
      setSessionState('active');
      persist(nextUser, 'active');
      return getHomeRoute(role);
    },
    [persist],
  );

  // Logging out keeps the profile so a return visit needs only the OTP, but it
  // must not leave the app in a half-signed-in state — the session flag is the
  // only thing the guards look at.
  const signOut = useCallback(() => {
    setSessionState(null);
    persist(user, null);
  }, [persist, user]);

  const continueAsGuest = useCallback(() => {
    setSessionState('guest');
    persist(user, 'guest');
  }, [persist, user]);

  // Full wipe, used by "forget this device" on the profile page.
  const forgetDevice = useCallback(() => {
    setUser(null);
    setSessionState(null);
    persist(null, null);
  }, [persist]);

  const value = useMemo(() => {
    const isAuthenticated = sessionState === 'active' && !!user;
    const isGuest = sessionState === 'guest' && !isAuthenticated;
    const role = isAuthenticated ? user.role : GUEST;

    // Each registration form captures a different name field. There is no
    // fallback to a placeholder person — an unnamed user is unnamed, and
    // callers decide how to greet them.
    const displayName = isAuthenticated
      ? user.fullName || user.stallName || user.businessName || user.ownerName || null
      : null;

    return {
      user: isAuthenticated ? user : null,
      // The profile survives sign-out so the login screen can offer a fast path back.
      knownProfile: user,
      role,
      roleMeta: ROLE_META[role] ?? null,
      isAuthenticated,
      isGuest,
      displayName,
      firstName: displayName ? displayName.split(' ')[0] : null,
      homeRoute: getHomeRoute(role),
      can: (capability) => roleCan(role, capability),
      signIn,
      signOut,
      continueAsGuest,
      forgetDevice,
    };
  }, [continueAsGuest, forgetDevice, sessionState, signIn, signOut, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
