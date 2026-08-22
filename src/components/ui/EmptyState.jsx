import React from 'react';
import Icon from '../AppIcon';

/**
 * Shown when a list has nothing in it. Always names what would appear here and
 * offers the action that would create it — an empty screen with no way forward
 * reads as a broken page.
 */
const EmptyState = ({ icon = 'Inbox', title, description, action }) => (
  <div className="card-warm px-6 py-12 flex flex-col items-center text-center">
    <span className="w-14 h-14 rounded-2xl bg-paper-dark/60 text-ink-medium flex items-center justify-center mb-4">
      <Icon name={icon} size={24} />
    </span>
    <h3 className="font-display font-bold text-lg text-ink">{title}</h3>
    {description && (
      <p className="text-ink-medium text-sm mt-1.5 max-w-sm leading-relaxed">{description}</p>
    )}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

export default EmptyState;
