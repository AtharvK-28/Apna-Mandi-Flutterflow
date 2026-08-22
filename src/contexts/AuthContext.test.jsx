import React from 'react';
import { act, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AuthProvider, useAuth } from './AuthContext';
import { ROLES } from '../config/roles';

let auth;
const Probe = () => {
  auth = useAuth();
  return (
    <div>
      <span data-testid="role">{auth.role}</span>
      <span data-testid="name">{auth.displayName ?? 'NONE'}</span>
      <span data-testid="state">
        {auth.isAuthenticated ? 'authed' : auth.isGuest ? 'guest' : 'anon'}
      </span>
    </div>
  );
};

const mount = () => render(<AuthProvider><Probe /></AuthProvider>);

describe('sessions', () => {
  it('starts anonymous with nothing stored', () => {
    mount();
    expect(screen.getByTestId('state')).toHaveTextContent('anon');
    expect(screen.getByTestId('role')).toHaveTextContent('guest');
  });

  it('signs in and returns the role"s landing route', () => {
    mount();
    let destination;
    act(() => {
      destination = auth.signIn(ROLES.KARIGAR, { fullName: 'Amit Kumar', phone: '9876543212' });
    });
    expect(destination).toBe('/karigar/find-work');
    expect(screen.getByTestId('state')).toHaveTextContent('authed');
    expect(screen.getByTestId('name')).toHaveTextContent('Amit Kumar');
  });

  it('refuses to sign in with a role that does not exist', () => {
    mount();
    expect(() => act(() => { auth.signIn('admin', {}); })).toThrow(/Unknown role/);
  });

  it('keeps the profile after sign-out so a return visit needs only the OTP', () => {
    mount();
    act(() => { auth.signIn(ROLES.VENDOR, { stallName: 'Sharma Chaat', phone: '9876543210' }); });
    act(() => { auth.signOut(); });

    expect(screen.getByTestId('state')).toHaveTextContent('anon');
    expect(auth.knownProfile?.stallName).toBe('Sharma Chaat');
    expect(auth.user).toBeNull();
  });

  it('wipes the profile when the device is forgotten', () => {
    mount();
    act(() => { auth.signIn(ROLES.VENDOR, { stallName: 'Sharma Chaat' }); });
    act(() => { auth.forgetDevice(); });

    expect(auth.knownProfile).toBeNull();
    expect(localStorage.getItem('apna-mandi-user')).toBeNull();
  });

  it('treats a guest as unauthenticated with only browse capability', () => {
    mount();
    act(() => { auth.continueAsGuest(); });

    expect(screen.getByTestId('state')).toHaveTextContent('guest');
    expect(auth.can('browse')).toBe(true);
    expect(auth.can('cart')).toBe(false);
  });
});

describe('identity', () => {
  it('never invents a name for someone who has not given one', () => {
    // The old helper fell back to a hardcoded "Rajesh Kumar", so guests and
    // half-registered users were greeted as a person who does not exist.
    mount();
    act(() => { auth.signIn(ROLES.SUPPLIER, { phone: '9876543211' }); });
    expect(screen.getByTestId('name')).toHaveTextContent('NONE');
    expect(auth.firstName).toBeNull();
  });

  it('reads whichever name field the role"s registration captured', () => {
    mount();
    act(() => { auth.signIn(ROLES.SUPPLIER, { businessName: 'Fresh Produce Co.' }); });
    expect(auth.displayName).toBe('Fresh Produce Co.');
    expect(auth.firstName).toBe('Fresh');
  });
});

describe('legacy storage migration', () => {
  it('adopts an old userData/userType session on first read', () => {
    localStorage.setItem('userData', JSON.stringify({ stallName: 'Old Stall', phone: '9876543210' }));
    localStorage.setItem('userType', ROLES.VENDOR);
    localStorage.setItem('apna-mandi-session', 'active');

    mount();
    expect(screen.getByTestId('state')).toHaveTextContent('authed');
    expect(screen.getByTestId('role')).toHaveTextContent(ROLES.VENDOR);
    expect(screen.getByTestId('name')).toHaveTextContent('Old Stall');
  });

  it('clears the legacy keys once it writes the new shape', () => {
    localStorage.setItem('userData', JSON.stringify({ stallName: 'Old Stall' }));
    localStorage.setItem('userType', ROLES.VENDOR);

    mount();
    act(() => { auth.signIn(ROLES.VENDOR, { stallName: 'Old Stall' }); });

    expect(localStorage.getItem('userData')).toBeNull();
    expect(localStorage.getItem('userType')).toBeNull();
    expect(JSON.parse(localStorage.getItem('apna-mandi-user')).role).toBe(ROLES.VENDOR);
  });

  it('ignores corrupt stored JSON instead of crashing on load', () => {
    localStorage.setItem('apna-mandi-user', '{not valid json');
    localStorage.setItem('apna-mandi-session', 'active');

    mount();
    expect(screen.getByTestId('state')).toHaveTextContent('anon');
  });

  it('ignores a stored profile whose role is unknown', () => {
    localStorage.setItem('apna-mandi-user', JSON.stringify({ role: 'admin' }));
    localStorage.setItem('apna-mandi-session', 'active');

    mount();
    expect(screen.getByTestId('state')).toHaveTextContent('anon');
  });
});
