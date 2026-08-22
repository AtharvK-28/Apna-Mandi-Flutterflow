import { useCallback, useEffect, useRef, useState } from 'react';
import { getRecognitionConstructor, useVoice } from '../contexts/VoiceContext';

// Each error the API reports, in words a vendor can act on. The raw codes
// ('not-allowed', 'audio-capture') mean nothing to anyone outside the spec.
const ERROR_MESSAGES = {
  'not-allowed': 'Microphone access is blocked. Allow it in your browser settings to dictate.',
  'service-not-allowed': 'Microphone access is blocked. Allow it in your browser settings to dictate.',
  'audio-capture': 'No microphone found. Check that one is connected.',
  network: 'Dictation needs an internet connection. Type instead, or try again.',
  'no-speech': "Didn't catch that. Tap the mic and speak again.",
  aborted: null, // The user stopped it deliberately; not worth a message.
};

/**
 * Dictation for a single field.
 *
 * Per-component rather than global: a page can have several mics (a search box
 * and a message composer), and each needs its own transcript and state.
 *
 * @param onResult   called with the final transcript when the user stops
 * @param onInterim  called with in-progress text, for live feedback
 */
export const useSpeechRecognition = ({ onResult, onInterim } = {}) => {
  const { language, canListen } = useVoice();

  const [isListening, setIsListening] = useState(false);
  const [interim, setInterim] = useState('');
  const [error, setError] = useState(null);

  const recognitionRef = useRef(null);
  const finalRef = useRef('');
  // Callbacks are held in refs so restarting recognition does not depend on the
  // caller memoising its handlers.
  const handlersRef = useRef({ onResult, onInterim });
  handlersRef.current = { onResult, onInterim };

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
  }, []);

  const start = useCallback(() => {
    if (!canListen) return;

    // A second start() on a running instance throws InvalidStateError.
    if (recognitionRef.current) {
      stop();
      return;
    }

    const Recognition = getRecognitionConstructor();
    if (!Recognition) return;

    const recognition = new Recognition();
    recognition.lang = language;
    // Single utterance: the user taps, says one thing, and we commit it.
    // Continuous mode holds the mic open, which is both a privacy problem and
    // a battery one on the phones this app targets.
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    finalRef.current = '';
    setError(null);
    setInterim('');

    recognition.onresult = (event) => {
      let finalText = '';
      let interimText = '';

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        if (result.isFinal) finalText += result[0].transcript;
        else interimText += result[0].transcript;
      }

      if (finalText) finalRef.current += finalText;
      setInterim(interimText);
      handlersRef.current.onInterim?.(finalRef.current + interimText);
    };

    recognition.onerror = (event) => {
      const message = ERROR_MESSAGES[event.error];
      // `undefined` means an error code we have no wording for; show something
      // rather than failing silently. `null` means deliberately silent.
      if (message !== null) {
        setError(message ?? 'Dictation stopped unexpectedly. Try again, or type instead.');
      }
    };

    recognition.onend = () => {
      recognitionRef.current = null;
      setIsListening(false);
      setInterim('');

      const transcript = finalRef.current.trim();
      if (transcript) handlersRef.current.onResult?.(transcript);
    };

    recognitionRef.current = recognition;
    setIsListening(true);

    try {
      recognition.start();
    } catch {
      // Safari throws if start() lands while a previous session is tearing down.
      recognitionRef.current = null;
      setIsListening(false);
    }
  }, [canListen, language, stop]);

  // An open microphone must not outlive the component that opened it.
  useEffect(
    () => () => {
      const recognition = recognitionRef.current;
      if (recognition) {
        recognition.onend = null;
        recognition.onresult = null;
        recognition.onerror = null;
        recognition.abort();
        recognitionRef.current = null;
      }
    },
    [],
  );

  return {
    isListening,
    interim,
    error,
    supported: canListen,
    start,
    stop,
    toggle: isListening ? stop : start,
    clearError: () => setError(null),
  };
};
