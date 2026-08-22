import React from 'react';
import { Helmet } from 'react-helmet-async';
import Header from './Header';

/**
 * Standard page frame: document title, role-aware header, and a centred column.
 * Every page used to re-declare this and they had drifted apart on width,
 * padding and heading size — which is most of why the app looked assembled
 * rather than designed.
 */
const PageShell = ({
  title,
  documentTitle,
  subtitle,
  actions,
  width = 'default',
  children,
}) => {
  const maxWidth = {
    default: 'max-w-5xl',
    wide: 'max-w-7xl',
    narrow: 'max-w-3xl',
  }[width];

  return (
    <div className="min-h-screen font-body">
      <Helmet>
        <title>{documentTitle ?? `${title} — Apna Mandi`}</title>
      </Helmet>

      <Header />

      <main id="main-content" tabIndex={-1} className={`${maxWidth} mx-auto px-4 pt-6 pb-16 outline-none`}>
        {(title || actions) && (
          <div className="flex items-start justify-between gap-4 mb-5 px-1">
            <div className="min-w-0">
              <h1 className="font-display font-extrabold text-[26px] md:text-3xl text-ink leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-ink-medium text-sm mt-1 max-w-xl">{subtitle}</p>
              )}
            </div>
            {actions && <div className="flex items-center gap-2 flex-shrink-0">{actions}</div>}
          </div>
        )}
        {children}
      </main>
    </div>
  );
};

export default PageShell;
