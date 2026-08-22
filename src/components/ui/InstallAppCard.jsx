import React from 'react';
import Icon from '../AppIcon';
import useInstallPrompt from '../../hooks/useInstallPrompt';
import { useToast } from '../../contexts/ToastContext';

/**
 * Offers to put Apna Mandi on the home screen.
 *
 * Renders nothing when the app is already installed or the browser has not
 * offered — an "Install" button that does nothing when tapped is worse than
 * no button. On iOS, where there is no programmatic install, it shows the
 * actual steps instead of a button that cannot work.
 */
const InstallAppCard = () => {
  const { canInstall, installed, platform, install } = useInstallPrompt();
  const toast = useToast();

  if (installed) return null;

  const handleInstall = async () => {
    const outcome = await install();
    if (outcome === 'accepted') toast.success('Apna Mandi added to your home screen');
    else if (outcome === 'unavailable') {
      toast.info('Your browser hasn’t offered to install yet — try again in a moment');
    }
  };

  if (platform === 'ios') {
    return (
      <div className="rounded-2xl border border-paper-dark bg-paper/60 p-4">
        <div className="flex items-start gap-3">
          <span className="w-9 h-9 rounded-xl bg-terracotta-light text-terracotta-dark flex items-center justify-center flex-shrink-0">
            <Icon name="Smartphone" size={17} />
          </span>
          <div className="min-w-0">
            <p className="text-sm font-bold text-ink">Add to your home screen</p>
            <p className="text-xs text-ink-medium leading-relaxed mt-1">
              In Safari, tap <span className="font-semibold text-ink">Share</span>, then{' '}
              <span className="font-semibold text-ink">Add to Home Screen</span>. Apna Mandi then
              opens like any other app, and keeps working when signal drops.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!canInstall) return null;

  return (
    <div className="rounded-2xl border border-paper-dark bg-paper/60 p-4">
      <div className="flex items-start gap-3">
        <span className="w-9 h-9 rounded-xl bg-terracotta-light text-terracotta-dark flex items-center justify-center flex-shrink-0">
          <Icon name="Download" size={17} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-ink">Install Apna Mandi</p>
          <p className="text-xs text-ink-medium leading-relaxed mt-1">
            Adds an icon to your home screen, opens without the browser bar, and keeps working when
            signal drops.
          </p>
          <button
            type="button"
            onClick={handleInstall}
            className="press mt-3 rounded-xl bg-terracotta text-white px-4 py-2 text-xs font-extrabold hover:bg-terracotta-dark transition-colors"
          >
            Install
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallAppCard;
