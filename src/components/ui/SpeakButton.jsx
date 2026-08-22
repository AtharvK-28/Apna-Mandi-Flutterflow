import React from 'react';
import Icon from '../AppIcon';
import { useVoice } from '../../contexts/VoiceContext';

/**
 * Reads a block of text aloud.
 *
 * Pair it with content a user might need while their hands are busy — a gig's
 * pay and timing, an order's status, an earnings summary. `id` must be unique
 * per button on a page so only the one actually speaking shows as active.
 */
const SpeakButton = ({
  text,
  id,
  label = 'this',
  size = 'default',
  // The summaries in utils/speech.js are generated in English, so read-aloud
  // defaults to English rather than the user's *dictation* language — those
  // are different settings. Pass `lang` explicitly for localised content.
  lang = 'en-IN',
  className = '',
}) => {
  const { canSpeak, speak, isSpeaking } = useVoice();

  if (!canSpeak || !text) return null;

  const speaking = isSpeaking(id);
  const dimensions = size === 'sm' ? 'w-7 h-7' : 'w-9 h-9';
  const iconSize = size === 'sm' ? 13 : 16;

  return (
    <button
      type="button"
      onClick={() => speak(text, { id, lang })}
      aria-label={speaking ? `Stop reading ${label}` : `Read ${label} aloud`}
      aria-pressed={speaking}
      title={speaking ? 'Stop reading' : 'Read aloud'}
      className={`press ${dimensions} rounded-xl flex items-center justify-center transition-colors flex-shrink-0 ${
        speaking
          ? 'bg-terracotta text-white'
          : 'bg-paper border border-paper-dark text-ink-light hover:text-ink hover:bg-paper-dark/60'
      } ${className}`}
    >
      <Icon name={speaking ? 'Square' : 'Volume2'} size={iconSize} />
    </button>
  );
};

export default SpeakButton;
