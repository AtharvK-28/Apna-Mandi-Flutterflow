import { useEffect, useRef } from 'react';

/**
 * Closes a popover on Escape or a click outside it.
 *
 * The header's dropdowns had neither, so opening the account menu and then
 * clicking anywhere else on the page left it hanging open over the content.
 *
 * @param isOpen  whether the popover is currently shown
 * @param onClose called when the user dismisses it
 * @returns ref to attach to the popover's outermost element
 */
export const useDismissable = (isOpen, onClose) => {
  const ref = useRef(null);

  useEffect(() => {
    if (!isOpen) return undefined;

    const handlePointerDown = (event) => {
      if (ref.current && !ref.current.contains(event.target)) onClose();
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') onClose();
    };

    // `pointerdown` rather than `click` so the menu closes before a click on
    // something underneath it is dispatched.
    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return ref;
};
