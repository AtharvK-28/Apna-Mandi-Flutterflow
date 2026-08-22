/**
 * Keyword intent matching for spoken commands.
 *
 * Deliberately simple and deliberately honest: this is keyword and number
 * matching over a transcript, not natural-language understanding. It recognises
 * the three things a vendor actually says mid-service and says plainly when it
 * has not understood, rather than guessing.
 *
 * Vendors code-switch constantly, so each intent carries both English and
 * romanised Hindi/Marathi keywords — "10 kilo pyaaz mangwa do" and "order 10 kg
 * onions" have to reach the same place. Devanagari is matched too, since
 * dictation in hi-IN returns Devanagari rather than transliteration.
 */

export const INTENTS = {
  ORDER: 'order',
  GIG: 'gig',
  SURPLUS: 'surplus',
  UNKNOWN: 'unknown',
};

// Each intent has *strong* keywords that identify it on their own, and *weak*
// ones that only suggest it. "chahiye" ("is needed") is weak — it appears in
// both "helper chahiye" and "10 kilo pyaaz chahiye" — so a strong match must
// always beat it, or asking for a helper silently starts a supply order.
const RULES = [
  {
    intent: INTENTS.ORDER,
    icon: 'ShoppingCart',
    label: 'Supply order',
    route: '/cart',
    strong: ['order', 'mangwa', 'mangva', 'supply', 'stock', 'मंगवा', 'ऑर्डर'],
    weak: ['buy', 'kilo', 'kg', 'chahiye', 'pahije', 'lena', 'चाहिए', 'किलो'],
  },
  {
    intent: INTENTS.GIG,
    icon: 'Wrench',
    label: 'Karigar gig',
    route: '/karigar-connect',
    strong: [
      'helper', 'karigar', 'staff', 'worker', 'hire', 'shift', 'madad',
      'कारीगर', 'मदद', 'हेल्पर',
    ],
    weak: ['banda', 'aadmi', 'chahiye', 'चाहिए'],
  },
  {
    intent: INTENTS.SURPLUS,
    icon: 'RefreshCw',
    label: 'Exchange listing',
    route: '/vendor-exchange',
    strong: [
      'surplus', 'exchange', 'leftover', 'bacha', 'bache',
      'बचा', 'सरप्लस', 'एक्सचेंज',
    ],
    weak: ['extra', 'spare'],
  },
];

// Common items, so a matched order can name what it heard rather than echoing
// the raw transcript back.
const ITEMS = [
  { name: 'Onions', match: ['pyaaz', 'pyaz', 'onion', 'kanda', 'प्याज', 'कांदा'] },
  { name: 'Potatoes', match: ['aloo', 'alu', 'potato', 'batata', 'आलू', 'बटाटा'] },
  { name: 'Tomatoes', match: ['tamatar', 'tomato', 'टमाटर'] },
  { name: 'Milk', match: ['doodh', 'milk', 'दूध'] },
  { name: 'Oil', match: ['tel', 'oil', 'तेल'] },
  { name: 'Besan', match: ['besan', 'बेसन'] },
  { name: 'Rice', match: ['chawal', 'rice', 'चावल'] },
  { name: 'Batter', match: ['batter', 'ghol', 'घोल'] },
];

const UNITS = [
  { unit: 'kg', match: ['kilo', 'kg', 'kilogram', 'किलो'] },
  { unit: 'litre', match: ['litre', 'liter', 'ltr', 'लीटर'] },
  { unit: 'packet', match: ['packet', 'pack', 'पैकेट'] },
];

// Spoken numbers that recognition may return as words rather than digits.
const NUMBER_WORDS = {
  one: 1, ek: 1, do: 2, two: 2, teen: 3, three: 3, char: 4, chaar: 4, four: 4,
  paanch: 5, panch: 5, five: 5, das: 10, ten: 10, bees: 20, twenty: 20,
  pachas: 50, fifty: 50, sau: 100, hundred: 100,
};

const includesAny = (haystack, needles) =>
  needles.some((needle) => haystack.includes(needle));

const extractQuantity = (text) => {
  const digits = text.match(/\b(\d+(?:\.\d+)?)\b/);
  if (digits) return Number(digits[1]);

  const word = Object.keys(NUMBER_WORDS).find((key) =>
    new RegExp(`\\b${key}\\b`).test(text),
  );
  return word ? NUMBER_WORDS[word] : null;
};

/**
 * @param transcript raw text from speech recognition
 * @returns { intent, label, icon, route, quantity, unit, item, transcript }
 */
export const parseVoiceCommand = (transcript) => {
  const text = String(transcript ?? '').toLowerCase().trim();

  if (!text) {
    return { intent: INTENTS.UNKNOWN, transcript: '', label: null, icon: null, route: null };
  }

  // Strong signals decide outright; weak ones only apply if nothing is strong.
  const rule =
    RULES.find((candidate) => includesAny(text, candidate.strong)) ??
    RULES.find((candidate) => includesAny(text, candidate.weak));

  if (!rule) {
    return {
      intent: INTENTS.UNKNOWN,
      transcript,
      label: null,
      icon: null,
      route: null,
    };
  }

  return {
    intent: rule.intent,
    label: rule.label,
    icon: rule.icon,
    route: rule.route,
    transcript,
    quantity: extractQuantity(text),
    unit: UNITS.find((u) => includesAny(text, u.match))?.unit ?? null,
    item: ITEMS.find((i) => includesAny(text, i.match))?.name ?? null,
  };
};

/** A one-line readback of what was understood, shown before anything is done. */
export const describeCommand = (command) => {
  if (command.intent === INTENTS.UNKNOWN) return null;

  const amount = [command.quantity, command.unit].filter(Boolean).join(' ');
  const subject = [amount, command.item].filter(Boolean).join(' ');

  if (command.intent === INTENTS.ORDER) {
    return subject ? `Order ${subject}` : 'Start a supply order';
  }
  if (command.intent === INTENTS.GIG) {
    return 'Post a gig on Karigar Connect';
  }
  return subject ? `List ${subject} as surplus` : 'List surplus on Vendor Exchange';
};
