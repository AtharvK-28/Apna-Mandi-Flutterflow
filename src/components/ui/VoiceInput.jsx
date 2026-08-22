import React from 'react';
import Icon from '../AppIcon';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';

/**
 * A mic button that dictates into a text field.
 *
 * Renders nothing at all where dictation is unsupported (Firefox, insecure
 * origins) rather than showing a button that cannot work — a dead control is
 * worse than an absent one.
 *
 * @param onTranscript  receives the final text when the user stops speaking
 * @param onInterim     optional live text, for showing words as they arrive
 * @param label         what is being dictated, for the accessible name
 */
const VoiceInput = ({ onTranscript, onInterim, label = 'this field', className = '' }) => {
  const { isListening, error, supported, toggle, clearError } = useSpeechRecognition({
    onResult: onTranscript,
    onInterim,
  });

  if (!supported) return null;

  return (
    <span className={`relative inline-flex ${className}`}>
      <button
        type="button"
        onClick={() => {
          clearError();
          toggle();
        }}
        aria-label={isListening ? `Stop dictating ${label}` : `Dictate ${label} by voice`}
        aria-pressed={isListening}
        title={isListening ? 'Listening — tap to stop' : 'Dictate by voice'}
        className={`press w-9 h-9 rounded-xl flex items-center justify-center transition-colors flex-shrink-0 ${
          isListening
            ? 'bg-chili text-white'
            : 'bg-paper border border-paper-dark text-ink-light hover:text-ink hover:bg-paper-dark/60'
        }`}
      >
        <Icon name={isListening ? 'Square' : 'Mic'} size={16} />
        {isListening && (
          <span className="absolute inset-0 rounded-xl bg-chili/40 animate-ping pointer-events-none" />
        )}
      </button>

      {/* Announced politely so a screen-reader user learns the mic is live
          without having the current reading interrupted. */}
      <span className="sr-only" role="status" aria-live="polite">
        {isListening ? 'Listening' : ''}
      </span>

      {error && (
        <span
          role="alert"
          className="absolute top-full right-0 mt-2 w-60 z-30 bg-paper-light border border-chili/40 rounded-xl px-3 py-2 shadow-lg"
        >
          <span className="block text-xs text-ink leading-relaxed">{error}</span>
          <button
            type="button"
            onClick={clearError}
            className="mt-1.5 text-[11px] font-bold text-terracotta-dark hover:text-terracotta"
          >
            Dismiss
          </button>
        </span>
      )}
    </span>
  );
};

export default VoiceInput;
