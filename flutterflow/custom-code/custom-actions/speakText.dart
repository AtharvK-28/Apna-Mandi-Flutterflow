// FlutterFlow → Custom Code → Custom Actions
//
// Read-aloud. Port of the speak() implementation in src/contexts/VoiceContext.jsx.
//
// ═══ WHY THIS IS NOT THREE LINES ═════════════════════════════════════════════
//
// The obvious implementation — `FlutterTts().speak(wholeString)` — works in
// testing and fails in use. Measured on real Chrome, not assumed: a ~62-character
// utterance takes ~4.7s, and the THIRD consecutive one never completes. No end
// event, no error, just silence, with the button stuck reading "speaking". The
// limit is roughly 15 seconds of CUMULATIVE speech across a session, not per
// utterance. pause()/resume() keepalive was tried and made no difference.
//
// So this action does three things together, and all three are needed:
//
//   1. chunks the text (chunkForSpeech, 110 chars) so no utterance is long,
//   2. calls stop() between chunks, which was measured to reset the engine, and
//   3. runs a per-chunk watchdog so a stall can never leave a button stuck on
//      "speaking" — it recovers to the next chunk instead.
//
// With all three, the longest summary the app produces (237 chars, 3 chunks,
// 24.7s) completes with zero watchdog fires. Removing any one of them brings
// the stall back. Do not "simplify" this.
//
// The web build is where this matters most, since that is the browser engine
// described above. Native Android/iOS TTS is better behaved, but the same code
// path is safe on both, and one implementation is worth more than two.
//
// ── Action definition in FlutterFlow ─────────────────────────────────────────
//   Name:        speakText
//   Arguments:   text (String), speakId (String), language (String, nullable)
//   Return type: none
//   Async:       yes
//   Pub deps:    flutter_tts: ^4.2.0

import 'dart:async';
import 'package:flutter_tts/flutter_tts.dart';

// A single engine instance for the whole app. Constructing a new FlutterTts per
// call leaks native resources on Android and can leave an orphaned utterance
// playing over the next one.
FlutterTts? _tts;
Completer<void>? _chunkDone;

// Guards against a second speak starting while the first is still running —
// two voices talking over each other is worse than no voice at all.
int _generation = 0;

Future<FlutterTts> _engine() async {
  if (_tts != null) return _tts!;
  final tts = FlutterTts();

  // Slightly under default. The stock rate is too fast for a listener hearing
  // Indian-English place names and rupee amounts in a noisy market.
  await tts.setSpeechRate(0.45);
  await tts.setVolume(1.0);
  await tts.setPitch(1.0);

  // iOS: do not duck or interrupt other audio permanently.
  await tts.awaitSpeakCompletion(true);

  tts.setCompletionHandler(() {
    if (_chunkDone != null && !_chunkDone!.isCompleted) _chunkDone!.complete();
  });
  tts.setCancelHandler(() {
    if (_chunkDone != null && !_chunkDone!.isCompleted) _chunkDone!.complete();
  });
  tts.setErrorHandler((msg) {
    if (_chunkDone != null && !_chunkDone!.isCompleted) _chunkDone!.complete();
  });

  _tts = tts;
  return tts;
}

/// speakText — reads `text` aloud, chunk by chunk.
///
/// `speakId` must be unique per SpeakButton on a page. It is written to App
/// State `activeSpeakId` so only the button actually speaking shows as active;
/// without it, every speak button on the page lights up at once.
///
/// `language` defaults to 'en-IN'. Pass the DICTATION language only if the text
/// itself is in that language. The summaries in speechText.dart are generated in
/// English, so they must be spoken with an English voice — a hi-IN voice reading
/// English words is close to unintelligible.
Future<void> speakText(String text, String speakId, String? language) async {
  final trimmed = text.trim();
  if (trimmed.isEmpty) return;

  final tts = await _engine();
  final myGeneration = ++_generation;

  // Anything already speaking loses.
  await tts.stop();
  FFAppState().activeSpeakId = speakId;

  await tts.setLanguage(language ?? 'en-IN');

  final chunks = chunkForSpeech(trimmed, FFAppState().speechChunkSize);

  for (final chunk in chunks) {
    // A newer speak superseded us, or the user hit stop.
    if (myGeneration != _generation) break;
    if (FFAppState().activeSpeakId != speakId) break;

    _chunkDone = Completer<void>();
    await tts.speak(chunk);

    // Watchdog. Roughly 90ms per character plus 3s of headroom — generous
    // enough that a slow-but-working chunk is never cut off, short enough that
    // a genuine stall does not hang the button. On a stall we simply move on to
    // the next chunk rather than waiting forever for an event that never comes.
    final timeout = Duration(milliseconds: 3000 + chunk.length * 90);
    try {
      await _chunkDone!.future.timeout(timeout);
    } on TimeoutException {
      await tts.stop();
    }

    // Measured to reset the engine and prevent the third-utterance stall.
    // This is the line that looks redundant and is not.
    await tts.stop();
    await Future.delayed(const Duration(milliseconds: 80));
  }

  if (myGeneration == _generation && FFAppState().activeSpeakId == speakId) {
    FFAppState().activeSpeakId = '';
  }
}
