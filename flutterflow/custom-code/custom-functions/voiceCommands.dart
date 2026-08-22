// FlutterFlow → Custom Code → Custom Functions
//
// Keyword intent matching for spoken commands. Port of src/utils/voiceCommands.js.
//
// Deliberately simple and deliberately honest: this is keyword and number
// matching over a transcript, not natural-language understanding. It recognises
// the three things a vendor actually says mid-service and says plainly when it
// has not understood, rather than guessing.
//
// Vendors code-switch constantly, so each intent carries English AND romanised
// Hindi/Marathi keywords — "10 kilo pyaaz mangwa do" and "order 10 kg onions"
// have to reach the same place. Devanagari is matched too, since dictation in
// hi-IN returns Devanagari rather than transliteration. Dropping any one of the
// three writing systems silently breaks the feature for a whole set of users.

const String kIntentOrder = 'order';
const String kIntentGig = 'gig';
const String kIntentSurplus = 'surplus';
const String kIntentUnknown = 'unknown';

// Each intent has *strong* keywords that identify it on their own, and *weak*
// ones that only suggest it. "chahiye" ("is needed") is weak — it appears in
// both "helper chahiye" and "10 kilo pyaaz chahiye" — so a strong match must
// always beat it. Without this split, asking for a helper silently started a
// supply order.
const List<Map<String, dynamic>> _rules = [
  {
    'intent': kIntentOrder,
    'icon': 'shopping_cart_outlined',
    'label': 'Supply order',
    'route': '/cart',
    'strong': ['order', 'mangwa', 'mangva', 'supply', 'stock', 'मंगवा', 'ऑर्डर'],
    'weak': ['buy', 'kilo', 'kg', 'chahiye', 'pahije', 'lena', 'चाहिए', 'किलो'],
  },
  {
    'intent': kIntentGig,
    'icon': 'handyman',
    'label': 'Karigar gig',
    'route': '/karigar-connect',
    'strong': [
      'helper', 'karigar', 'staff', 'worker', 'hire', 'shift', 'madad',
      'कारीगर', 'मदद', 'हेल्पर',
    ],
    'weak': ['banda', 'aadmi', 'chahiye', 'चाहिए'],
  },
  {
    'intent': kIntentSurplus,
    'icon': 'swap_horiz',
    'label': 'Exchange listing',
    'route': '/vendor-exchange',
    'strong': [
      'surplus', 'exchange', 'leftover', 'bacha', 'bache',
      'बचा', 'सरप्लस', 'एक्सचेंज',
    ],
    'weak': ['extra', 'spare'],
  },
];

// Common items, so a matched order can name what it heard rather than echoing
// the raw transcript back.
const List<Map<String, dynamic>> _items = [
  {'name': 'Onions', 'match': ['pyaaz', 'pyaz', 'onion', 'kanda', 'प्याज', 'कांदा']},
  {'name': 'Potatoes', 'match': ['aloo', 'alu', 'potato', 'batata', 'आलू', 'बटाटा']},
  {'name': 'Tomatoes', 'match': ['tamatar', 'tomato', 'टमाटर']},
  {'name': 'Milk', 'match': ['doodh', 'milk', 'दूध']},
  {'name': 'Oil', 'match': ['tel', 'oil', 'तेल']},
  {'name': 'Besan', 'match': ['besan', 'बेसन']},
  {'name': 'Rice', 'match': ['chawal', 'rice', 'चावल']},
  {'name': 'Batter', 'match': ['batter', 'ghol', 'घोल']},
];

const List<Map<String, dynamic>> _units = [
  {'unit': 'kg', 'match': ['kilo', 'kg', 'kilogram', 'किलो']},
  {'unit': 'litre', 'match': ['litre', 'liter', 'ltr', 'लीटर']},
  {'unit': 'packet', 'match': ['packet', 'pack', 'पैकेट']},
];

// Spoken numbers that recognition may return as words rather than digits.
const Map<String, int> _numberWords = {
  'one': 1, 'ek': 1, 'do': 2, 'two': 2, 'teen': 3, 'three': 3,
  'char': 4, 'chaar': 4, 'four': 4, 'paanch': 5, 'panch': 5, 'five': 5,
  'das': 10, 'ten': 10, 'bees': 20, 'twenty': 20,
  'pachas': 50, 'fifty': 50, 'sau': 100, 'hundred': 100,
};

bool _includesAny(String haystack, List<dynamic> needles) =>
    needles.any((n) => haystack.contains(n.toString()));

int? _extractQuantity(String text) {
  final digits = RegExp(r'\b(\d+(?:\.\d+)?)\b').firstMatch(text);
  if (digits != null) {
    final parsed = double.tryParse(digits.group(1)!);
    if (parsed != null) return parsed.round();
  }
  for (final entry in _numberWords.entries) {
    if (RegExp('\\b${entry.key}\\b').hasMatch(text)) return entry.value;
  }
  return null;
}

/// FF: parseVoiceCommand(String? transcript) -> dynamic   [Return type: JSON]
///
/// Returns {intent, label, icon, route, quantity, unit, item, transcript}.
/// An unrecognised phrase returns intent `unknown` with null label/route —
/// the caller must show "didn't catch that", never fall back to a best guess.
dynamic parseVoiceCommand(String? transcript) {
  final raw = transcript ?? '';
  final text = raw.toLowerCase().trim();

  Map<String, dynamic> unknown() => {
        'intent': kIntentUnknown,
        'transcript': raw,
        'label': null,
        'icon': null,
        'route': null,
        'quantity': null,
        'unit': null,
        'item': null,
      };

  if (text.isEmpty) return unknown();

  // Strong signals decide outright; weak ones only apply if nothing is strong.
  Map<String, dynamic>? rule;
  for (final candidate in _rules) {
    if (_includesAny(text, candidate['strong'] as List)) {
      rule = candidate;
      break;
    }
  }
  if (rule == null) {
    for (final candidate in _rules) {
      if (_includesAny(text, candidate['weak'] as List)) {
        rule = candidate;
        break;
      }
    }
  }
  if (rule == null) return unknown();

  String? unit;
  for (final u in _units) {
    if (_includesAny(text, u['match'] as List)) {
      unit = u['unit'] as String;
      break;
    }
  }

  String? item;
  for (final i in _items) {
    if (_includesAny(text, i['match'] as List)) {
      item = i['name'] as String;
      break;
    }
  }

  return {
    'intent': rule['intent'],
    'label': rule['label'],
    'icon': rule['icon'],
    'route': rule['route'],
    'transcript': raw,
    'quantity': _extractQuantity(text),
    'unit': unit,
    'item': item,
  };
}

/// FF: describeCommand(dynamic command) -> String
///
/// A one-line readback of what was understood. This is ALWAYS shown for
/// confirmation before anything is added to a cart or posted — keyword matching
/// gets things wrong, and a silent wrong action mid-service is far worse than
/// one extra tap. Returns '' when nothing was understood.
String describeCommand(dynamic command) {
  if (command == null) return '';
  final intent = command['intent'];
  if (intent == null || intent == kIntentUnknown) return '';

  final parts = <String>[];
  if (command['quantity'] != null) parts.add(command['quantity'].toString());
  if (command['unit'] != null) parts.add(command['unit'].toString());
  if (command['item'] != null) parts.add(command['item'].toString());
  final subject = parts.join(' ');

  if (intent == kIntentOrder) {
    return subject.isNotEmpty ? 'Order $subject' : 'Start a supply order';
  }
  if (intent == kIntentGig) {
    return 'Post a gig on Karigar Connect';
  }
  return subject.isNotEmpty
      ? 'List $subject as surplus'
      : 'List surplus on Vendor Exchange';
}
