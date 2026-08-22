import React, { useCallback, useMemo, useState } from 'react';
import Icon from '../AppIcon';
import { ROLES } from '../../config/roles';
import { useAuth } from '../../contexts/AuthContext';
import { useDismissable } from '../../hooks/useDismissable';

// Notifications are role-specific: a karigar is told a vendor confirmed them,
// a supplier is told a pool filled. The old shared list showed every user the
// same vendor-shaped messages.
const NOTIFICATIONS = {
  [ROLES.VENDOR]: [
    { id: 1, icon: 'Truck', title: 'Order on its way', message: 'Fresh Produce Co. left with your tomatoes and onions.', time: '2m ago', read: false },
    { id: 2, icon: 'Tag', title: 'Morning deals are live', message: '12 new fresh-morning deals within 2 km.', time: '25m ago', read: false },
    { id: 3, icon: 'Wrench', title: 'Karigar applied', message: 'Amit Kumar applied for your evening shift.', time: '1h ago', read: true },
  ],
  [ROLES.KARIGAR]: [
    { id: 1, icon: 'CheckCircle', title: 'You are confirmed', message: 'Delhi Chaat House confirmed you for Saturday, 6–11 PM.', time: '8m ago', read: false },
    { id: 2, icon: 'Zap', title: 'Urgent shift nearby', message: 'Wok master needed at Spice Garden, 400m away.', time: '40m ago', read: false },
    { id: 3, icon: 'IndianRupee', title: 'Payment received', message: '₹1,000 for the Saturday chaat shift has landed.', time: '2h ago', read: true },
  ],
  [ROLES.SUPPLIER]: [
    { id: 1, icon: 'Users', title: 'Mandi Pool filled', message: 'Dadar Vada Pav Pool hit 8 vendors — ready to process.', time: '2m ago', read: false },
    { id: 2, icon: 'AlertTriangle', title: 'Low stock', message: 'Fresh Tomatoes are below the minimum level.', time: '15m ago', read: false },
    { id: 3, icon: 'IndianRupee', title: 'Payment received', message: '₹630 UPI from Mumbai Dosa Corner.', time: '40m ago', read: true },
  ],
};

const NotificationCenter = ({ className = '' }) => {
  const { role } = useAuth();
  const [open, setOpen] = useState(false);
  const [readIds, setReadIds] = useState([]);

  const close = useCallback(() => setOpen(false), []);
  const ref = useDismissable(open, close);

  const items = useMemo(() => {
    const source = NOTIFICATIONS[role] ?? [];
    return source.map((item) => ({ ...item, read: item.read || readIds.includes(item.id) }));
  }, [readIds, role]);

  const unreadCount = items.filter((item) => !item.read).length;

  const handleToggle = () => {
    setOpen((wasOpen) => {
      // Opening the panel is what marks things read — not merely rendering it.
      if (!wasOpen) setReadIds(items.map((item) => item.id));
      return !wasOpen;
    });
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={handleToggle}
        aria-label={
          unreadCount ? `Notifications, ${unreadCount} unread` : 'Notifications'
        }
        aria-expanded={open}
        className="press relative w-9 h-9 rounded-xl bg-paper border border-paper-dark flex items-center justify-center text-ink-light hover:text-ink hover:bg-paper-dark/60 transition-colors"
      >
        <Icon name="Bell" size={17} />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-[7px] h-[7px] rounded-full bg-chili ring-2 ring-paper-light" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 card-warm overflow-hidden shadow-xl z-50 animate-slide-down">
          <div className="px-4 py-3 border-b border-paper-dark/60 flex items-center justify-between">
            <p className="font-display font-bold text-sm text-ink">Notifications</p>
            <button
              type="button"
              onClick={close}
              aria-label="Close notifications"
              className="press w-7 h-7 rounded-lg text-ink-medium hover:text-ink hover:bg-paper-dark/50 flex items-center justify-center transition-colors"
            >
              <Icon name="X" size={15} />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-paper-dark/50">
            {items.length ? (
              items.map((item) => (
                <div key={item.id} className="px-4 py-3 flex gap-3">
                  <span className="w-8 h-8 rounded-xl bg-paper-dark/60 text-ink-light flex items-center justify-center flex-shrink-0">
                    <Icon name={item.icon} size={15} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <p className="font-bold text-sm text-ink truncate">{item.title}</p>
                      <span className="text-[10px] font-semibold text-ink-medium flex-shrink-0">
                        {item.time}
                      </span>
                    </div>
                    <p className="text-xs text-ink-medium mt-0.5 leading-relaxed">
                      {item.message}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="px-4 py-8 text-sm text-ink-medium text-center">
                Nothing new right now.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
