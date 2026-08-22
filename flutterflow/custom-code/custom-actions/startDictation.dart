// FlutterFlow → Custom Code → Custom Actions
//
// Speech-to-text for a single field. Port of src/hooks/useSpeechRecognition.js.
//
//   Name:        startDictation
//   Arguments:   localeId (String, nullable) — 'en-IN' | 'hi-IN' | 'mr-IN'
//   Return type: String
//   Async:       yes
//   Pub deps:    speech_to_text: ^7.0.0
//
// Returns the final transcript, or '' if nothing was heard, permission was
// refused, or the device has no recognition service. The caller must handle ''
// as "didn't catch that" — never as an empty but valid answer that silently
// clears the field the user had already typed into.
//
// ── Availability ─────────────────────────────────────────────────────────────
// Dictation is not universally available. Call `isDictationAvailable()` and
// RENDER NOTHING where it returns false. A mic button that cannot work is worse
// than no mic button: the user taps it, nothing happens, and they conclude the
// app is broken rather than that the feature is unsupported.
//
// ── Privacy ──────────────────────────────────────────────────────────────────
// On the web build, Chrome sends dictated audio to Google for transcription.
// That fact is stated next to the switch in Profile → Settings, in plain words,
// not buried in a policy page. If you move the switch, move the sentence with it.

import 'package:speech_to_text/speech_to_text.dart';

SpeechToText? _speech;

/// isDictationAvailable — safe to call on every build; caches after the first.
Future<bool> isDictationAvailable() async {
  _speech ??= SpeechToText();
  if (_speech!.isAvailable) return true;
  try {
    return await _speech!.initialize(
      onError: (_) {},
      onStatus: (_) {},
      debugLogging: false,
    );
  } catch (_) {
    return false;
  }
}

Future<String> startDictation(String? localeId) async {
  _speech ??= SpeechToText();

  final available = await isDictationAvailable();
  if (!available) return '';

  // A second start while one is running throws on Android.
  if (_speech!.isListening) await _speech!.stop();

  var transcript = '';
  await _speech!.listen(
    localeId: localeId ?? 'en-IN',
    // 20s is long enough for "das kilo pyaaz aur paanch kilo aloo mangwa do"
    // said slowly by someone unused to talking to a phone.
    listenFor: const Duration(seconds: 20),
    // Stop after 3s of silence rather than waiting out the full window — a
    // vendor mid-service will not stand still watching a countdown.
    pauseFor: const Duration(seconds: 3),
    onResult: (result) {
      transcript = result.recognizedWords;
    },
    listenOptions: SpeechListenOptions(
      partialResults: true,
      cancelOnError: true,
      // Keeps the raw spoken form. Device-side punctuation guessing mangles
      // code-switched Hindi/English more often than it helps.
      listenMode: ListenMode.dictation,
    ),
  );

  // Wait for listening to finish (pauseFor or listenFor decides when).
  while (_speech!.isListening) {
    await Future.delayed(const Duration(milliseconds: 150));
  }

  return transcript.trim();
}

/// cancelDictation — separate action, same file. Bind to the mic button's
/// second tap and to On Page Dispose, so the mic is never left open when the
/// user leaves the screen.
Future<void> cancelDictation() async {
  try {
    if (_speech?.isListening ?? false) await _speech!.cancel();
  } catch (_) {}
}
