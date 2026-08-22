import React, { useCallback, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import { ROLES } from '../../config/roles';
import { useAuth } from '../../contexts/AuthContext';
import { useDismissable } from '../../hooks/useDismissable';

// Menu entries beyond Profile differ by role — sending a karigar to a vendor's
// order history was never useful.
const EXTRA_LINKS = {
  [ROLES.VENDOR]: [
    { to: '/orders', icon: 'Package', label: 'My orders' },
    { to: '/cart', icon: 'ShoppingCart', label: 'Cart' },
  ],
  [ROLES.KARIGAR]: [
    { to: '/karigar/my-work', icon: 'ClipboardList', label: 'My work' },
    { to: '/karigar/earnings', icon: 'IndianRupee', label: 'Earnings' },
  ],
  [ROLES.SUPPLIER]: [{ to: '/supplier/orders', icon: 'ClipboardList', label: 'Orders' }],
};

const AccountMenu = ({ className = '' }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const { user, displayName, role, roleMeta, signOut } = useAuth();

  const close = useCallback(() => setOpen(false), []);
  const ref = useDismissable(open, close);

  // A signed-in user without a name is possible mid-registration; show the role
  // rather than inventing a person, which is what the old placeholder did.
  const name = displayName ?? roleMeta?.label ?? 'Account';
  const initials = displayName
    ? displayName
        .split(' ')
        .map((part) => part[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : null;

  const handleSignOut = () => {
    close();
    signOut(); // keeps the profile so returning needs only the OTP
    navigate('/login', { replace: true });
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((wasOpen) => !wasOpen)}
        aria-expanded={open}
        aria-haspopup="menu"
        className="press flex items-center gap-2 h-9 pl-1 pr-2.5 rounded-xl bg-paper border border-paper-dark hover:bg-paper-dark/60 transition-colors"
      >
        <span className="w-7 h-7 rounded-lg bg-gradient-to-br from-terracotta to-chili text-white font-display font-bold text-xs flex items-center justify-center">
          {initials ?? <Icon name="User" size={14} />}
        </span>
        <span className="hidden lg:block text-sm font-semibold text-ink-light max-w-[110px] truncate">
          {name}
        </span>
        <Icon name="ChevronDown" size={14} className="text-ink-medium" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-60 card-warm overflow-hidden shadow-xl z-50 animate-slide-down"
        >
          <div className="px-4 py-3 border-b border-paper-dark/60">
            <p className="font-bold text-sm text-ink truncate">{name}</p>
            <p className="text-xs text-ink-medium mt-0.5 flex items-center gap-1.5">
              {roleMeta && <Icon name={roleMeta.icon} size={11} />}
              {roleMeta?.label}
              {user?.phone && (
                <>
                  <span aria-hidden>·</span>
                  <span>+91 {user.phone}</span>
                </>
              )}
            </p>
          </div>

          <div className="py-1">
            <Link
              to="/profile"
              role="menuitem"
              onClick={close}
              className="w-full px-4 py-2.5 flex items-center gap-2.5 text-sm font-semibold text-ink-light hover:bg-paper-dark/40 hover:text-ink transition-colors"
            >
              <Icon name="User" size={15} />
              Profile
            </Link>

            {(EXTRA_LINKS[role] ?? []).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                role="menuitem"
                onClick={close}
                className="w-full px-4 py-2.5 flex items-center gap-2.5 text-sm font-semibold text-ink-light hover:bg-paper-dark/40 hover:text-ink transition-colors"
              >
                <Icon name={item.icon} size={15} />
                {item.label}
              </Link>
            ))}
          </div>

          <div className="border-t border-paper-dark/60 py-1">
            <button
              type="button"
              role="menuitem"
              onClick={handleSignOut}
              className="w-full px-4 py-2.5 flex items-center gap-2.5 text-sm font-semibold text-chili hover:bg-chili-light transition-colors"
            >
              <Icon name="LogOut" size={15} />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountMenu;
