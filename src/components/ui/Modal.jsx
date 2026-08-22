import React, { useCallback, useEffect, useRef } from 'react';
import Icon from '../AppIcon';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Accessible dialog. The hand-rolled modals this replaces could not be closed
 * with Escape, let keyboard focus wander behind the overlay, and left the page
 * scrollable underneath.
 */
const Modal = ({ title, description, onClose, size = 'default', footer, children }) => {
  const panelRef = useRef(null);
  const restoreFocusTo = useRef(null);
  const titleId = useRef(`modal-title-${Math.random().toString(36).slice(2)}`).current;

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        onClose?.();
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) return;

      const focusable = Array.from(panelRef.current.querySelectorAll(FOCUSABLE)).filter(
        (el) => el.offsetParent !== null,
      );
      if (!focusable.length) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      // Wrap focus at both ends so Tab can never reach the page behind.
      if (event.shiftKey && (active === first || !panelRef.current.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    },
    [onClose],
  );

  useEffect(() => {
    restoreFocusTo.current = document.activeElement;
    const { overflow } = document.body.style;
    document.body.style.overflow = 'hidden';

    // Focus the panel itself rather than its first control, so screen readers
    // announce the dialog title before its contents.
    panelRef.current?.focus();

    return () => {
      document.body.style.overflow = overflow;
      restoreFocusTo.current?.focus?.();
    };
  }, []);

  const maxWidth = {
    default: 'max-w-lg',
    wide: 'max-w-3xl',
    narrow: 'max-w-sm',
  }[size];

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4"
      onKeyDown={handleKeyDown}
    >
      <div
        className="absolute inset-0 bg-ink/55 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className={`relative w-full ${maxWidth} bg-paper-light border border-paper-dark rounded-t-3xl sm:rounded-3xl shadow-2xl max-h-[92vh] sm:max-h-[85vh] flex flex-col outline-none animate-slide-down`}
      >
        <header className="flex items-start justify-between gap-4 px-5 py-4 border-b border-paper-dark/70">
          <div className="min-w-0">
            <h2 id={titleId} className="font-display font-bold text-lg text-ink leading-tight">
              {title}
            </h2>
            {description && <p className="text-ink-medium text-xs mt-1">{description}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="press w-9 h-9 rounded-xl bg-paper border border-paper-dark flex items-center justify-center text-ink-light hover:text-ink hover:bg-paper-dark/60 transition-colors flex-shrink-0"
          >
            <Icon name="X" size={17} />
          </button>
        </header>

        <div className="overflow-y-auto px-5 py-4 flex-1">{children}</div>

        {footer && (
          <footer className="px-5 py-4 border-t border-paper-dark/70 bg-paper/40 rounded-b-3xl">
            {footer}
          </footer>
        )}
      </div>
    </div>
  );
};

export default Modal;
