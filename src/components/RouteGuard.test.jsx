import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { HomeRedirect, Protected, PublicOnly } from './RouteGuard';
import { AuthProvider } from '../contexts/AuthContext';
import { ROLES } from '../config/roles';

// Seeds a session the way AuthProvider reads one back on mount.
const signedInAs = (role, profile = {}) => {
  localStorage.setItem('apna-mandi-user', JSON.stringify({ role, phone: '9876543210', ...profile }));
  localStorage.setItem('apna-mandi-session', 'active');
};

const asGuest = () => localStorage.setItem('apna-mandi-session', 'guest');

// Renders the guard under test plus enough landing pages to see where a
// redirect actually lands.
const renderAt = (path, element) =>
  render(
    <AuthProvider>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path={path} element={element} />
          <Route path="/login" element={<p>LOGIN</p>} />
          <Route path="/home" element={<p>VENDOR HOME</p>} />
          <Route path="/karigar/find-work" element={<p>KARIGAR HOME</p>} />
          <Route path="/supplier" element={<p>SUPPLIER HOME</p>} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>,
  );

describe('Protected', () => {
  it('sends a signed-out visitor to the login screen', () => {
    renderAt('/dashboard', <Protected allow={[ROLES.VENDOR]}><p>SECRET</p></Protected>);
    expect(screen.getByText('LOGIN')).toBeInTheDocument();
    expect(screen.queryByText('SECRET')).not.toBeInTheDocument();
  });

  it('lets the right role through', () => {
    signedInAs(ROLES.VENDOR);
    renderAt('/dashboard', <Protected allow={[ROLES.VENDOR]}><p>SECRET</p></Protected>);
    expect(screen.getByText('SECRET')).toBeInTheDocument();
  });

  it("redirects a signed-in user off another role's route, to their own home", () => {
    signedInAs(ROLES.KARIGAR);
    renderAt('/dashboard', <Protected allow={[ROLES.VENDOR]}><p>SECRET</p></Protected>);
    expect(screen.getByText('KARIGAR HOME')).toBeInTheDocument();
    expect(screen.queryByText('SECRET')).not.toBeInTheDocument();
  });

  it('keeps a supplier out of a vendor route', () => {
    signedInAs(ROLES.SUPPLIER);
    renderAt('/cart', <Protected allow={[ROLES.VENDOR]}><p>CART</p></Protected>);
    expect(screen.getByText('SUPPLIER HOME')).toBeInTheDocument();
  });

  it('blocks a guest from a route that has not opted into guest access', () => {
    asGuest();
    renderAt('/cart', <Protected allow={[ROLES.VENDOR]}><p>CART</p></Protected>);
    expect(screen.getByText('LOGIN')).toBeInTheDocument();
  });

  it('admits a guest to a route marked allowGuest', () => {
    asGuest();
    renderAt('/deals', <Protected allow={[ROLES.VENDOR]} allowGuest><p>DEALS</p></Protected>);
    expect(screen.getByText('DEALS')).toBeInTheDocument();
  });

  it('admits any signed-in role when no allow list is given', () => {
    signedInAs(ROLES.SUPPLIER);
    renderAt('/profile', <Protected><p>PROFILE</p></Protected>);
    expect(screen.getByText('PROFILE')).toBeInTheDocument();
  });

  it('refuses a stored profile whose role is not recognised', () => {
    // A tampered or stale profile must fail closed, not fall through the checks.
    localStorage.setItem('apna-mandi-user', JSON.stringify({ role: 'admin' }));
    localStorage.setItem('apna-mandi-session', 'active');
    renderAt('/dashboard', <Protected allow={[ROLES.VENDOR]}><p>SECRET</p></Protected>);
    expect(screen.getByText('LOGIN')).toBeInTheDocument();
  });

  it('treats a stored profile with no active session as signed out', () => {
    localStorage.setItem('apna-mandi-user', JSON.stringify({ role: ROLES.VENDOR }));
    renderAt('/dashboard', <Protected allow={[ROLES.VENDOR]}><p>SECRET</p></Protected>);
    expect(screen.getByText('LOGIN')).toBeInTheDocument();
  });
});

describe('PublicOnly', () => {
  it('shows the login screen to a signed-out visitor', () => {
    renderAt('/login', <PublicOnly><p>LOGIN FORM</p></PublicOnly>);
    expect(screen.getByText('LOGIN FORM')).toBeInTheDocument();
  });

  it('bounces an already signed-in user to their home', () => {
    signedInAs(ROLES.SUPPLIER);
    renderAt('/login', <PublicOnly><p>LOGIN FORM</p></PublicOnly>);
    expect(screen.getByText('SUPPLIER HOME')).toBeInTheDocument();
  });

  it('still lets a guest reach the login screen to sign in properly', () => {
    asGuest();
    renderAt('/login', <PublicOnly><p>LOGIN FORM</p></PublicOnly>);
    expect(screen.getByText('LOGIN FORM')).toBeInTheDocument();
  });
});

describe('HomeRedirect', () => {
  it.each([
    [ROLES.VENDOR, 'VENDOR HOME'],
    [ROLES.KARIGAR, 'KARIGAR HOME'],
    [ROLES.SUPPLIER, 'SUPPLIER HOME'],
  ])('sends a %s to their own front door', (role, expected) => {
    signedInAs(role);
    renderAt('/', <HomeRedirect />);
    expect(screen.getByText(expected)).toBeInTheDocument();
  });

  it('sends a signed-out visitor to login', () => {
    renderAt('/', <HomeRedirect />);
    expect(screen.getByText('LOGIN')).toBeInTheDocument();
  });

  it('sends a guest to the public home', () => {
    asGuest();
    renderAt('/', <HomeRedirect />);
    expect(screen.getByText('VENDOR HOME')).toBeInTheDocument();
  });
});
