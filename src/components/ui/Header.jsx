import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import ThemeToggle from './ThemeToggle';
import NotificationCenter from './NotificationCenter';
import AccountMenu from './AccountMenu';
import { getNavForRole } from '../../config/roles';
import { useAuth } from '../../contexts/AuthContext';

/**
 * The app shell's navigation.
 *
 * It used to render one hardcoded list of six vendor links for everyone, so a
 * karigar looking for shifts was offered wholesale deals and a vendor
 * procurement dashboard. The list now comes from the signed-in role.
 */
const Header = () => {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { role, isGuest, homeRoute } = useAuth();
  const { pathname } = useLocation();

  const navItems = getNavForRole(role);

  // A menu left open across a navigation covers the page the user just chose.
  useEffect(() => setMobileMenuOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* First thing in the tab order: lets keyboard and screen-reader users
          jump past the nav to the page content. */}
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <div className="h-[3px] bg-gradient-to-r from-terracotta via-turmeric to-leaf" />

      <div className="bg-paper-light/85 backdrop-blur-xl border-b border-paper-dark/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-3">
            <Link to={homeRoute} className="flex items-center gap-2.5 press flex-shrink-0">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-terracotta to-chili flex items-center justify-center text-white shadow-[0_6px_14px_-6px_rgba(192,83,46,.8)]">
                <Icon name="Store" size={18} />
              </div>
              <div className="hidden xs:block">
                <h1 className="font-display font-extrabold text-lg text-ink leading-none">
                  Apna Mandi
                </h1>
                <p className="text-[10px] text-ink-medium leading-none mt-1 tracking-wide">
                  अपना मंडी · Street Food OS
                </p>
              </div>
            </Link>

            <nav
              aria-label="Primary"
              className="hidden md:flex items-center gap-1 bg-paper/70 border border-paper-dark/60 rounded-full p-1"
            >
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3.5 py-2 rounded-full text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-terracotta text-white shadow-[0_6px_14px_-6px_rgba(192,83,46,.8)]'
                        : 'text-ink-light hover:bg-paper-dark/50 hover:text-ink'
                    }`
                  }
                >
                  <Icon name={item.icon} size={15} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center gap-2">
              <ThemeToggle className="hidden sm:flex" />

              {/* Guests have no account to notify, so the bell is signed-in only.
                  It opens the real notification panel — it used to be a button
                  with no handler sitting next to an unused NotificationCenter. */}
              {!isGuest && <NotificationCenter className="hidden sm:flex" />}

              {isGuest ? (
                <Link
                  to="/login"
                  className="press text-sm font-bold text-white bg-terracotta px-4 py-2 rounded-xl hover:bg-terracotta-dark transition-colors"
                >
                  Sign in
                </Link>
              ) : (
                <AccountMenu className="hidden sm:flex" />
              )}

              <button
                aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={isMobileMenuOpen}
                aria-controls="mobile-nav"
                className="press md:hidden w-9 h-9 rounded-xl bg-paper border border-paper-dark flex items-center justify-center text-ink-light"
                onClick={() => setMobileMenuOpen((open) => !open)}
              >
                <Icon name={isMobileMenuOpen ? 'X' : 'Menu'} size={18} />
              </button>
            </div>
          </div>
        </div>

        {isMobileMenuOpen && (
          <div
            id="mobile-nav"
            className="md:hidden border-t border-paper-dark/60 animate-slide-down"
          >
            <div className="px-4 py-3">
              <nav
                aria-label="Primary"
                className={`grid gap-2 ${navItems.length <= 4 ? 'grid-cols-4' : 'grid-cols-3'}`}
              >
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `press flex flex-col items-center gap-1.5 px-2 py-3 rounded-2xl text-xs font-semibold transition-colors ${
                        isActive
                          ? 'bg-terracotta text-white shadow-[0_6px_14px_-6px_rgba(192,83,46,.8)]'
                          : 'bg-paper text-ink-light border border-paper-dark/60'
                      }`
                    }
                  >
                    <Icon name={item.icon} size={19} />
                    <span className="text-center leading-tight">{item.label}</span>
                  </NavLink>
                ))}
              </nav>

              <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-paper-dark/60">
                <ThemeToggle />
                {!isGuest && <NotificationCenter />}
                {isGuest ? (
                  <Link
                    to="/login"
                    className="press text-sm font-bold text-white bg-terracotta px-4 py-2 rounded-xl"
                  >
                    Sign in
                  </Link>
                ) : (
                  <AccountMenu />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
