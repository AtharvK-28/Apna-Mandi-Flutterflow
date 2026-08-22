import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { GUEST_HOME, LOGIN_ROUTE } from '../config/roles';
import { useAuth } from '../contexts/AuthContext';

/**
 * Gates a route to a set of roles.
 *
 * Signed-out visitors go to the login screen, remembering where they were headed.
 * Signed-in users who reach a route belonging to a different role are sent to
 * their own home rather than shown an error — a karigar landing on the supplier
 * dashboard is a wrong turn, not a failure worth interrupting them for.
 *
 * @param allow      roles permitted here; omit to allow any signed-in user
 * @param allowGuest whether an account-less visitor may view this route
 */
export const Protected = ({ allow, allowGuest = false, children }) => {
  const { isAuthenticated, isGuest, role, homeRoute } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    if (isGuest && allowGuest) return children;
    return <Navigate to={LOGIN_ROUTE} replace state={{ from: location }} />;
  }

  if (allow && !allow.includes(role)) {
    return <Navigate to={homeRoute} replace />;
  }

  return children;
};

/**
 * For the login screen: an already-signed-in user should never see it again.
 * Guests may return to sign in properly, so they are not bounced.
 */
export const PublicOnly = ({ children }) => {
  const { isAuthenticated, homeRoute } = useAuth();
  const location = useLocation();

  if (isAuthenticated) {
    const intended = location.state?.from?.pathname;
    return <Navigate to={intended || homeRoute} replace />;
  }

  return children;
};

/**
 * Sends whoever is looking at it to the right front door. Used for `/`, and for
 * legacy aliases that no longer belong to a single role.
 */
export const HomeRedirect = () => {
  const { isAuthenticated, isGuest, homeRoute } = useAuth();
  if (isAuthenticated) return <Navigate to={homeRoute} replace />;
  if (isGuest) return <Navigate to={GUEST_HOME} replace />;
  return <Navigate to={LOGIN_ROUTE} replace />;
};
