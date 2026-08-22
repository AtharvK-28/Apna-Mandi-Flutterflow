import { describe, expect, it } from 'vitest';
import {
  ALL_ROLES,
  CAPABILITIES,
  GUEST,
  GUEST_HOME,
  NAV_BY_ROLE,
  ROLES,
  ROLE_META,
  can,
  getHomeRoute,
  getNavForRole,
  isRole,
} from './roles';

describe('role identity', () => {
  it('gives every role a landing route and an icon', () => {
    for (const role of ALL_ROLES) {
      expect(ROLE_META[role]?.home, `${role} has no home route`).toMatch(/^\//);
      expect(ROLE_META[role]?.icon).toBeTruthy();
      expect(ROLE_META[role]?.label).toBeTruthy();
    }
  });

  it('rejects anything that is not a known role', () => {
    expect(isRole('vendor')).toBe(true);
    expect(isRole('admin')).toBe(false);
    expect(isRole(GUEST)).toBe(false);
    expect(isRole(undefined)).toBe(false);
    expect(isRole(null)).toBe(false);
  });

  it('falls back to the guest home for an unknown role', () => {
    expect(getHomeRoute(ROLES.KARIGAR)).toBe('/karigar/find-work');
    expect(getHomeRoute('nonsense')).toBe(GUEST_HOME);
    expect(getHomeRoute(undefined)).toBe(GUEST_HOME);
  });
});

describe('navigation', () => {
  it('gives each role its own nav, and guests a fallback', () => {
    for (const role of ALL_ROLES) {
      expect(getNavForRole(role).length).toBeGreaterThan(0);
    }
    expect(getNavForRole('nonsense')).toEqual(NAV_BY_ROLE[GUEST]);
  });

  it('never points a role at another role"s landing page', () => {
    const homesByRole = Object.fromEntries(ALL_ROLES.map((r) => [r, ROLE_META[r].home]));

    for (const role of ALL_ROLES) {
      const otherHomes = ALL_ROLES.filter((r) => r !== role).map((r) => homesByRole[r]);
      for (const item of getNavForRole(role)) {
        expect(otherHomes, `${role} nav links to ${item.to}`).not.toContain(item.to);
      }
    }
  });

  it('has no duplicate destinations within a single nav', () => {
    for (const role of [...ALL_ROLES, GUEST]) {
      const targets = NAV_BY_ROLE[role].map((i) => i.to);
      expect(new Set(targets).size, `${role} nav repeats a route`).toBe(targets.length);
    }
  });
});

describe('capabilities', () => {
  it('gives the cart only to vendors', () => {
    expect(can(ROLES.VENDOR, 'cart')).toBe(true);
    expect(can(ROLES.KARIGAR, 'cart')).toBe(false);
    expect(can(ROLES.SUPPLIER, 'cart')).toBe(false);
    expect(can(GUEST, 'cart')).toBe(false);
  });

  it('treats an unknown role as a guest rather than granting everything', () => {
    expect(can('admin', 'cart')).toBe(false);
    expect(can(undefined, 'hire')).toBe(false);
    expect(can('admin', 'browse')).toBe(true);
  });

  it('defines capabilities for every role', () => {
    for (const role of [...ALL_ROLES, GUEST]) {
      expect(Array.isArray(CAPABILITIES[role]), `${role} has no capability list`).toBe(true);
    }
  });
});
