// FlutterFlow → Custom Code → Custom Functions
//
// Turning screen text into text worth hearing. Port of src/utils/speech.js.
//
// Reading the UI verbatim gives poor results: "₹750" is announced as a symbol
// name or dropped entirely, "5:00 PM - 10:00 PM" becomes "five colon zero zero",
// and "1.2km" runs together. These helpers produce a sentence a person would
// actually say, which is what gets passed to the TTS engine.
//
// NEVER pass a raw UI string to speakText(). Pass it through one of these first.
//
// ── Language ─────────────────────────────────────────────────────────────────
// Read-aloud language is NOT the dictation language. The summaries below are
// generated in English, so speakText defaults to `en-IN`. The setting in
// Profile → Settings governs *dictation* only. Speaking English words with a
// hi-IN voice produces something close to unintelligible.

import 'package:intl/intl.dart';

/// FF: spokenAmount(double? value) -> String
/// 1200 → "1,200 rupees". Empty string for null, so a missing price is silent
/// rather than announced as "0 rupees".
String spokenAmount(double? value) {
  if (value == null) return '';
  final formatted = NumberFormat.decimalPattern('en_IN').format(value);
  return '$formatted rupees';
}

/// FF: spokenTime(String? value) -> String
/// "5:00 PM - 10:00 PM" → "5 PM to 10 PM". ":30" is kept, so "5:30 PM" survives.
String spokenTime(String? value) {
  if (value == null || value.isEmpty) return '';
  return value
      .replaceAll(RegExp(r'\s*[-–—]\s*'), ' to ')
      .replaceAllMapped(RegExp(r'(\d{1,2}):00'), (m) => m.group(1)!)
      .replaceAll(RegExp(r'\s+'), ' ')
      .trim();
}

/// FF: spokenDistance(String? value) -> String
/// "200m away" → "200 metres away"; "1.2 km" → "1.2 kilometres".
String spokenDistance(String? value) {
  if (value == null || value.isEmpty) return '';
  return value
      .replaceAllMapped(RegExp(r'(\d)\s*km\b', caseSensitive: false),
          (m) => '${m.group(1)} kilometres')
      .replaceAllMapped(RegExp(r'(\d)\s*m\b', caseSensitive: false),
          (m) => '${m.group(1)} metres')
      .trim();
}

/// Drops empty parts so a missing field never becomes a spoken "null".
String _sentence(List<String?> parts) {
  final kept = parts.where((p) => p != null && p.trim().isNotEmpty).map((p) => p!.trim());
  if (kept.isEmpty) return '';
  return '${kept.join('. ')}.'.replaceAll('..', '.');
}

/// FF: spokenGig(String? title, String? vendorName, double? totalPay,
///               double? ratePerHour, String? when, String? distance,
///               String? location, String? urgency) -> String
///
/// What a karigar needs to hear about a shift, in the order they need it: what
/// the work is, when, what it pays, how far. Every part is built only from
/// fields that exist — interpolating a missing one straight into a template is
/// what made the voice say "null".
String spokenGig(
  String? title,
  String? vendorName,
  double? totalPay,
  double? ratePerHour,
  String? when,
  String? distance,
  String? location,
  String? urgency,
) {
  final pay = <String>[
    if (totalPay != null) '${spokenAmount(totalPay)} for the shift',
    if (ratePerHour != null) '${spokenAmount(ratePerHour)} per hour',
  ].join(', ');

  final where = <String>[
    if (distance != null && distance.isNotEmpty) spokenDistance(distance),
    if (location != null && location.isNotEmpty) 'at $location',
  ].join(', ');

  return _sentence([
    title,
    vendorName != null && vendorName.isNotEmpty ? 'Posted by $vendorName' : null,
    when != null && when.isNotEmpty ? spokenTime(when) : null,
    pay.isNotEmpty ? pay : null,
    where.isNotEmpty ? where : null,
    urgency == 'high' ? 'This one is urgent' : null,
  ]);
}

/// FF: spokenDeal(String? name, double? price, String? unit,
///                double? originalPrice, String? supplierName,
///                String? distance) -> String
String spokenDeal(
  String? name,
  double? price,
  String? unit,
  double? originalPrice,
  String? supplierName,
  String? distance,
) {
  final priceLine = price == null
      ? null
      : '${spokenAmount(price)}${unit != null && unit.isNotEmpty ? ' per $unit' : ''}';

  String? saving;
  if (price != null && originalPrice != null && originalPrice > price) {
    final pct = (((originalPrice - price) / originalPrice) * 100).round();
    saving = '$pct percent off';
  }

  return _sentence([
    name,
    priceLine,
    saving,
    supplierName != null && supplierName.isNotEmpty ? 'From $supplierName' : null,
    distance != null && distance.isNotEmpty ? spokenDistance(distance) : null,
  ]);
}

/// FF: spokenOrder(String? orderNumber, String? status, int? itemCount,
///                 double? total, String? deliverySlot) -> String
String spokenOrder(
  String? orderNumber,
  String? status,
  int? itemCount,
  double? total,
  String? deliverySlot,
) {
  // Spell the number out of its display form — "#ORD001" is read as
  // "hash oh arr dee zero zero one" otherwise.
  final id = orderNumber?.replaceAll('#', 'Order ').replaceAll('ORD', 'number ');

  return _sentence([
    id,
    status != null ? _spokenStatus(status) : null,
    itemCount != null ? '$itemCount item${itemCount == 1 ? '' : 's'}' : null,
    total != null ? 'Total ${spokenAmount(total)}' : null,
    deliverySlot != null && deliverySlot.isNotEmpty
        ? 'Arriving ${spokenTime(deliverySlot)}'
        : null,
  ]);
}

String _spokenStatus(String status) {
  switch (status) {
    case 'pending':
      return 'Waiting for the supplier to confirm';
    case 'confirmed':
      return 'Confirmed by the supplier';
    case 'packed':
      return 'Packed and ready';
    case 'out-for-delivery':
      return 'On the way to you';
    case 'delivered':
      return 'Delivered';
    case 'cancelled':
      return 'Cancelled';
    default:
      return '';
  }
}

// ═════════════════════════════════════════════════════════════════════════════
// Chunking
// ═════════════════════════════════════════════════════════════════════════════

/// FF: chunkForSpeech(String? text, int maxLength) -> List<String>
///
/// Splits at sentence boundaries first, then at commas, then at word boundaries
/// — never mid-word, which produces audible nonsense.
///
/// Why chunking exists at all: browser and platform TTS engines stall on long
/// utterances. Measured on real Chrome, not assumed — a ~62-character utterance
/// takes ~4.7s, and the *third consecutive* one never completes: no end event,
/// no error, just silence. The limit is roughly 15 seconds of CUMULATIVE speech
/// across a session, not per utterance. Keeping every utterance short is one of
/// the three things that make read-aloud reliable; see speakText.dart for the
/// other two.
///
/// Pass maxLength = 110 (App State constant `speechChunkSize`).
List<String> chunkForSpeech(String? text, int maxLength) {
  final input = (text ?? '').trim();
  if (input.isEmpty) return [];
  if (input.length <= maxLength) return [input];

  final chunks = <String>[];
  final sentences = input.split(RegExp(r'(?<=[.!?])\s+'));
  var buffer = '';

  void flush() {
    if (buffer.trim().isNotEmpty) chunks.add(buffer.trim());
    buffer = '';
  }

  for (final sentence in sentences) {
    if (sentence.length > maxLength) {
      flush();
      // Too long even alone — break on commas, then on words.
      final pieces = sentence.split(RegExp(r'(?<=,)\s+'));
      for (final piece in pieces) {
        if (piece.length > maxLength) {
          var line = '';
          for (final word in piece.split(' ')) {
            if (line.isEmpty) {
              line = word;
            } else if (line.length + 1 + word.length <= maxLength) {
              line = '$line $word';
            } else {
              chunks.add(line);
              line = word;
            }
          }
          if (line.isNotEmpty) chunks.add(line);
        } else if (buffer.length + piece.length + 1 <= maxLength) {
          buffer = buffer.isEmpty ? piece : '$buffer $piece';
        } else {
          flush();
          buffer = piece;
        }
      }
      flush();
    } else if (buffer.length + sentence.length + 1 <= maxLength) {
      buffer = buffer.isEmpty ? sentence : '$buffer $sentence';
    } else {
      flush();
      buffer = sentence;
    }
  }
  flush();

  return chunks;
}
