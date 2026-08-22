import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

/**
 * Speech support, built on the browser's Web Speech API.
 *
 * Voice matters more than usual for this app: a vendor mid-service has both
 * hands in a wok, a karigar may be reading on a cracked phone in the sun, and
 * literacy varies. So dictation and read-aloud are treated as real input
 * methods rather than decoration.
 *
 * The API has two halves with very different support:
 *   - speechSynthesis (read aloud) works essentially everywhere.
 *   - SpeechRecognition (dictation) is Chrome/Edge/Safari only, is prefixed,
 *     needs a secure context, and in Chrome streams audio to Google's servers.
 *
 * Nothing here is polyfilled or faked. Where a capability is missing the
 * affordance is hidden rather than shown broken.
 */

// Marathi is included because the app's world is Mumbai; a Dadar vendor is as
// likely to dictate in Marathi as in Hindi.
export const VOICE_LANGUAGES = [
  { code: 'en-IN', label: 'English', native: 'English' },
  { code: 'hi-IN', label: 'Hindi', native: 'हिंदी' },
  { code: 'mr-IN', label: 'Marathi', native: 'मराठी' },
];

// Chrome's synthesiser stops after roughly 15 seconds of *cumulative* speech
// and fires no event at all — not `end`, not `error`. Measured here: a ~62
// character utterance takes ~4.7s, and the third consecutive one never
// completed. Two things follow, and both are needed:
//
//   1. Text is spoken as a series of short utterances (this chunker), and
//   2. the engine is reset with cancel() between them, which was measured to
//      restore it. `pause()`/`resume()` keepalive was tried and did nothing.
// Splitting on sentence boundaries keeps the prosody natural; an over-long
// sentence is split on commas, and failing that hard-wrapped.
const MAX_CHUNK = 110;

export const chunkForSpeech = (text, maxLength = MAX_CHUNK) => {
  const clean = String(text ?? '').replace(/\s+/g, ' ').trim();
  if (!clean) return [];
  if (clean.length <= maxLength) return [clean];

  const chunks = [];
  let current = '';

  const push = () => {
    if (current.trim()) chunks.push(current.trim());
    current = '';
  };

  for (const sentence of clean.split(/(?<=[.!?])\s+/)) {
    if (sentence.length > maxLength) {
      push();
      let rest = sentence;
      while (rest.length > maxLength) {
        // Prefer a comma, then any space, before cutting mid-word.
        const window_ = rest.slice(0, maxLength);
        const cut = Math.max(window_.lastIndexOf(', '), window_.lastIndexOf(' '));
        const at = cut > maxLength * 0.5 ? cut : maxLength;
        chunks.push(rest.slice(0, at).trim());
        rest = rest.slice(at).trim();
      }
      current = rest;
    } else if ((current + ' ' + sentence).trim().length > maxLength) {
      push();
      current = sentence;
    } else {
      current = current ? `${current} ${sentence}` : sentence;
    }
  }
  push();

  return chunks.filter(Boolean);
};

const STORAGE = {
  language: 'apna-mandi-voice-language',
  enabled: 'apna-mandi-voice-enabled',
};

const readStored = (key, fallback) => {
  try {
    return localStorage.getItem(key) ?? fallback;
  } catch {
    return fallback;
  }
};

export const getRecognitionConstructor = () =>
  typeof window === 'undefined'
    ? null
    : window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;

const VoiceContext = createContext(null);

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) throw new Error('useVoice must be used within a VoiceProvider');
  return context;
};

export const VoiceProvider = ({ children }) => {
  const [language, setLanguageState] = useState(() =>
    readStored(STORAGE.language, 'en-IN'),
  );
  // Opt-out rather than opt-in: the affordances are additive and never remove
  // the ability to type or read.
  const [enabled, setEnabledState] = useState(
    () => readStored(STORAGE.enabled, 'true') !== 'false',
  );
  const [voices, setVoices] = useState([]);
  const [speakingId, setSpeakingId] = useState(null);

  // Pending chunks for the utterance currently being read.
  const queueRef = useRef([]);

  const canSpeak =
    typeof window !== 'undefined' && typeof window.speechSynthesis !== 'undefined';

  // Dictation additionally needs a secure context; getUserMedia is blocked on
  // plain http, so offering a mic there would just fail at the permission step.
  const canListen =
    !!getRecognitionConstructor() &&
    (typeof window === 'undefined' ||
      window.isSecureContext ||
      window.location.hostname === 'localhost');

  // Chrome returns an empty voice list on the first call and fills it
  // asynchronously, which is the usual reason read-aloud picks the wrong accent.
  useEffect(() => {
    if (!canSpeak) return undefined;

    const load = () => setVoices(window.speechSynthesis.getVoices());
    load();
    window.speechSynthesis.addEventListener('voiceschanged', load);
    return () => window.speechSynthesis.removeEventListener('voiceschanged', load);
  }, [canSpeak]);

  // Leaving an utterance running after the component unmounts means a page the
  // user has navigated away from keeps talking.
  useEffect(
    () => () => {
      if (canSpeak) window.speechSynthesis.cancel();
    },
    [canSpeak],
  );

  const setLanguage = useCallback((code) => {
    setLanguageState(code);
    try {
      localStorage.setItem(STORAGE.language, code);
    } catch {
      // Private mode; the in-memory choice still applies for this session.
    }
  }, []);

  const setEnabled = useCallback(
    (next) => {
      setEnabledState(next);
      try {
        localStorage.setItem(STORAGE.enabled, String(next));
      } catch {
        // As above.
      }
      if (!next && canSpeak) window.speechSynthesis.cancel();
    },
    [canSpeak],
  );

  // Prefer an exact locale match, then any voice for the same base language,
  // so "hi-IN" still finds a "hi" voice rather than falling back to English.
  const voiceFor = useCallback(
    (code) => {
      if (!voices.length) return null;
      const base = code.split('-')[0];
      return (
        voices.find((v) => v.lang === code) ??
        voices.find((v) => v.lang?.replace('_', '-') === code) ??
        voices.find((v) => v.lang?.startsWith(base)) ??
        null
      );
    },
    [voices],
  );

  // Every speak() call gets a token. Handlers compare against the live token
  // before touching state, which is what makes the cancel race below safe.
  const sessionRef = useRef(0);

  const stop = useCallback(() => {
    if (!canSpeak) return;
    sessionRef.current += 1; // invalidate any in-flight handlers
    window.speechSynthesis.cancel();
    queueRef.current = [];
    setSpeakingId(null);
  }, [canSpeak]);

  /**
   * Reads `text` aloud. `id` lets a specific button show its own speaking
   * state, so two read-aloud buttons on one page do not both animate.
   *
   * Two Chrome behaviours are worked around here, both confirmed by probing the
   * real API rather than assumed:
   *
   *  1. An utterance longer than ~15 seconds stops producing audio and fires
   *     NEITHER `end` NOR `error` — it simply stalls. A 1,788-character string
   *     sat in `start` for 25 seconds. Text is therefore split into short
   *     chunks spoken in sequence, so no single utterance reaches the limit.
   *
   *  2. `cancel()` fires the previous utterance's `error: interrupted` AFTER
   *     the next `speak()` has been registered. Clearing state in that handler
   *     wiped the speaking state of the utterance that was correctly playing,
   *     so the button showed idle while audio played. Handlers now no-op unless
   *     they belong to the current session.
   */
  const speak = useCallback(
    (text, { id = 'default', lang = language, rate = 0.95 } = {}) => {
      if (!canSpeak || !enabled || !text) return;

      const wasSpeakingThis = speakingId === id;

      sessionRef.current += 1;
      const session = sessionRef.current;
      window.speechSynthesis.cancel();
      queueRef.current = [];

      // Tapping the button that is already speaking means "stop".
      if (wasSpeakingThis) {
        setSpeakingId(null);
        return;
      }

      // If the device has no voice for this language, speaking text tagged
      // with it produces mispronounced output. Falling back to the device
      // default is the lesser evil, and settings already warns about it.
      const voice = voiceFor(lang);
      const effectiveLang = voice ? lang : undefined;
      const chunks = chunkForSpeech(text);
      queueRef.current = chunks;
      setSpeakingId(id);

      // Roughly how long a chunk takes to speak, measured at ~13 characters
      // per second at rate 1. Used only to size the watchdog.
      const estimateMs = (chunk) => (chunk.length / 13) * (1000 / rate);

      const speakNext = (index) => {
        // A newer speak()/stop() has superseded this one.
        if (session !== sessionRef.current) return;

        if (index >= chunks.length) {
          setSpeakingId(null);
          return;
        }

        const chunk = chunks[index];
        const utterance = new SpeechSynthesisUtterance(chunk);
        if (effectiveLang) utterance.lang = effectiveLang;
        // Slightly under normal pace: these are prices, quantities and
        // addresses, and the default rate is hard to follow for numbers.
        utterance.rate = rate;
        if (voice) utterance.voice = voice;

        // If the engine stalls, no event ever arrives and the button would stay
        // stuck on "speaking" forever. The watchdog guarantees it always
        // resolves — recovering to the next chunk rather than dying silently.
        let settled = false;
        const advance = (nextIndex) => {
          if (settled) return;
          settled = true;
          clearTimeout(watchdog);
          if (session !== sessionRef.current) return;
          speakNext(nextIndex);
        };

        const watchdog = setTimeout(() => {
          if (settled || session !== sessionRef.current) return;
          window.speechSynthesis.cancel(); // resets a stalled engine
          advance(index + 1);
        }, estimateMs(chunk) + 4000);

        utterance.onend = () => advance(index + 1);
        utterance.onerror = (event) => {
          if (event.error === 'interrupted' || event.error === 'canceled') {
            // A newer request took over; this session is already invalid.
            settled = true;
            clearTimeout(watchdog);
            return;
          }
          if (settled) return;
          settled = true;
          clearTimeout(watchdog);
          if (session === sessionRef.current) setSpeakingId(null);
        };

        // Resetting between chunks keeps cumulative speaking time inside the
        // engine's limit. Nothing is playing at this point, so this only clears
        // engine state rather than cutting audio short.
        if (index > 0) window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
      };

      speakNext(0);
    },
    [canSpeak, enabled, language, speakingId, voiceFor],
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      enabled,
      setEnabled,
      canSpeak: canSpeak && enabled,
      canListen: canListen && enabled,
      // Reported separately so settings can explain *why* dictation is missing
      // rather than silently hiding the option.
      recognitionSupported: !!getRecognitionConstructor(),
      speak,
      stop,
      speakingId,
      isSpeaking: (id = 'default') => speakingId === id,
      hasVoiceFor: (code = language) => !!voiceFor(code),
    }),
    [
      canListen,
      canSpeak,
      enabled,
      language,
      setEnabled,
      setLanguage,
      speak,
      speakingId,
      stop,
      voiceFor,
    ],
  );

  return <VoiceContext.Provider value={value}>{children}</VoiceContext.Provider>;
};
