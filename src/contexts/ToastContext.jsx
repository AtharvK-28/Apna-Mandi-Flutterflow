import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import Icon from '../components/AppIcon';

/**
 * App-wide transient messages.
 *
 * Replaces the browser `alert()` calls scattered through the app: those block
 * the whole page until dismissed, cannot be styled or themed, read poorly to
 * screen readers, and on mobile browsers are easy to fire twice. They were also
 * being used to report success, which should never stop someone's work.
 */

const ToastContext = createContext(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};

const VARIANTS = {
  success: { icon: 'CheckCircle', tint: 'bg-leaf-light text-leaf-dark' },
  error: { icon: 'AlertCircle', tint: 'bg-chili-light text-chili' },
  info: { icon: 'Info', tint: 'bg-turmeric-light text-turmeric-dark' },
};

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const show = useCallback(
    (message, { variant = 'success', duration = 4000 } = {}) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev, { id, message, variant }]);
      if (duration) setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss],
  );

  const value = useMemo(
    () => ({
      toast: show,
      success: (message, options) => show(message, { ...options, variant: 'success' }),
      error: (message, options) => show(message, { ...options, variant: 'error' }),
      info: (message, options) => show(message, { ...options, variant: 'info' }),
      dismiss,
    }),
    [dismiss, show],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}

      {/* aria-live so the message is announced without stealing focus */}
      <div
        role="status"
        aria-live="polite"
        className="fixed inset-x-4 bottom-5 sm:left-auto sm:right-5 sm:w-96 z-[200] flex flex-col gap-2 pointer-events-none"
      >
        {toasts.map((item) => {
          const variant = VARIANTS[item.variant] ?? VARIANTS.success;
          return (
            <div
              key={item.id}
              className="pointer-events-auto card-warm px-4 py-3 flex items-start gap-3 shadow-xl animate-slide-down"
            >
              <span
                className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${variant.tint}`}
              >
                <Icon name={variant.icon} size={16} />
              </span>
              <p className="text-sm text-ink font-medium flex-1 leading-relaxed">{item.message}</p>
              <button
                type="button"
                onClick={() => dismiss(item.id)}
                aria-label="Dismiss notification"
                className="press text-ink-medium hover:text-ink flex-shrink-0 mt-0.5"
              >
                <Icon name="X" size={15} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};
