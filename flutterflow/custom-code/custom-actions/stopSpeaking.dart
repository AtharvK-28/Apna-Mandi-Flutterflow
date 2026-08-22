// FlutterFlow → Custom Code → Custom Actions
//
//   Name:        stopSpeaking
//   Arguments:   none
//   Return type: none
//   Async:       yes
//
// Call this from:
//   • the SpeakButton's own tap, when it is already the active speaker (tap to
//     stop is the expected behaviour, and there is no other way to shut it up),
//   • every page's On Page Dispose. A voice that keeps reading the previous
//     screen after the user has navigated away is disorienting, and on a shared
//     phone in a market it is genuinely embarrassing.

import 'package:flutter_tts/flutter_tts.dart';

Future<void> stopSpeaking() async {
  try {
    await FlutterTts().stop();
  } catch (_) {
    // A stop on an engine that was never started throws on some Android
    // versions. There is nothing to recover — the desired state (silence) is
    // already true.
  }
  FFAppState().activeSpeakId = '';
}
