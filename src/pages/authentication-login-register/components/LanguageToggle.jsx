import React from 'react';
import Icon from '../../../components/AppIcon';

const LANGUAGES = {
  // Hindi is not spoken in the United States and English is not the language of
  // a flag, so the old 🇺🇸/🇮🇳 pair was both wrong and unnecessary. The scripts
  // identify the languages on their own.
  en: { short: 'EN', label: 'English' },
  hi: { short: 'हि', label: 'हिंदी' },
};

/**
 * Controlled by the page rather than owning its own state. It used to write the
 * choice to localStorage while the page read that value only once on mount, so
 * pressing the toggle changed nothing until a refresh.
 */
const LanguageToggle = ({ value, onChange }) => {
  const next = value === 'en' ? 'hi' : 'en';

  return (
    <button
      type="button"
      onClick={() => onChange(next)}
      aria-label={`Switch to ${LANGUAGES[next].label}`}
      className="press inline-flex items-center gap-2 h-9 px-3 rounded-xl bg-paper border border-paper-dark text-ink-light hover:text-ink hover:bg-paper-dark/60 transition-colors"
    >
      <Icon name="Languages" size={15} />
      <span className="text-sm font-bold">{LANGUAGES[value]?.label ?? LANGUAGES.en.label}</span>
      <span className="text-[10px] font-extrabold text-ink-medium bg-paper-dark/70 px-1.5 py-0.5 rounded">
        {LANGUAGES[next].short}
      </span>
    </button>
  );
};

export default LanguageToggle;
