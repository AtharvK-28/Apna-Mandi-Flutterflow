// FlutterFlow → Custom Code → Custom Functions
//
// Vyapaar Readiness Score. Port of src/data/vyapaar.js.
//
// ═══ READ THIS BEFORE CHANGING ANYTHING IN THIS FILE ═════════════════════════
//
// This is deliberately NOT a credit score. In India a credit score is issued by
// an RBI-licensed credit information company (CIBIL, Experian, Equifax, CRIF)
// from regulated bureau data. Apna Mandi has no such licence and no bureau feed,
// so this measures something narrower and honest: how much verifiable trading
// history a vendor has built on this platform.
//
// Constraints that are regulatory, not cosmetic:
//   • Never present this as a credit score. The card carries a disclaimer that
//     it does not affect CIBIL / Experian / Equifax / CRIF.
//   • Apna Mandi is not a lender. Do not add "pre-approved" amounts, interest
//     rates, or offers anywhere near this number.
//   • The only lending action permitted is consent to share the record with
//     named, regulated lenders, who decide for themselves.
//   • If a real lending flow is ever added it needs a named RBI-registered
//     lender, a Key Fact Statement, APR (not "% per month"), a cooling-off
//     period, and a grievance contact.
//
// It is computed from the vendor's own activity — every band below maps to a
// countable event, so a vendor can always see why the number moved.
// ═════════════════════════════════════════════════════════════════════════════

const int kMaxScore = 900;
const int kBaseScore = 300; // Everyone starts here on their first order.

/// FF: scoreFactors() -> List<dynamic>   [Return type: JSON]
///
/// Each factor caps at `max`, so no single behaviour can carry the whole score.
List<dynamic> scoreFactors() => [
      {
        'id': 'procurement',
        'icon': 'shopping_cart_outlined',
        'label': 'Buying regularly',
        'explain':
            'Supplier orders placed and paid for, weighted towards a steady weekly rhythm.',
        'max': 180,
      },
      {
        'id': 'gigPayments',
        'icon': 'handyman',
        'label': 'Paying karigars on time',
        'explain':
            'Gigs settled within the agreed window, with no unresolved disputes.',
        'max': 150,
      },
      {
        'id': 'exchange',
        'icon': 'swap_horiz',
        'label': 'Trading on the Exchange',
        'explain':
            'Completed surplus trades with nearby stalls, both sides confirming.',
        'max': 120,
      },
      {
        'id': 'ratings',
        'icon': 'star_rounded',
        'label': 'Customer ratings',
        'explain': 'Average rating across verified orders over the last 90 days.',
        'max': 90,
      },
      {
        'id': 'hygiene',
        'icon': 'verified_user',
        'label': 'Swachh hygiene grade',
        'explain': 'Current grade from your most recent verified hygiene audit.',
        'max': 60,
      },
    ];

/// FF: computeVyapaarScore(List<dynamic>? activity) -> int
///
/// `activity` is the vendor's `vyapaarFactors` list, each entry
/// {factorId, earned, detail, trend}. A missing factor scores zero rather than
/// being skipped — a vendor with no gig history should see that gap, not have
/// it quietly excluded from the denominator.
int computeVyapaarScore(List<dynamic>? activity) {
  final byId = <String, dynamic>{};
  for (final entry in (activity ?? [])) {
    final id = entry is Map ? entry['factorId'] : null;
    if (id != null) byId[id.toString()] = entry;
  }

  var total = 0;
  for (final factor in scoreFactors()) {
    final max = factor['max'] as int;
    final record = byId[factor['id']];
    final rawEarned = record is Map ? (record['earned'] ?? 0) : 0;
    final earned = (rawEarned is num) ? rawEarned.toInt() : 0;
    // Clamp so bad data can never inflate a score past a factor's ceiling.
    total += earned.clamp(0, max);
  }

  final score = kBaseScore + total;
  return score > kMaxScore ? kMaxScore : score;
}

/// FF: vyapaarBreakdown(List<dynamic>? activity) -> List<dynamic>   [JSON]
///
/// The per-factor rows the card renders: label, explanation, earned, ceiling,
/// a 0–1 share for the progress bar, and the month-over-month trend.
List<dynamic> vyapaarBreakdown(List<dynamic>? activity) {
  final byId = <String, dynamic>{};
  for (final entry in (activity ?? [])) {
    final id = entry is Map ? entry['factorId'] : null;
    if (id != null) byId[id.toString()] = entry;
  }

  return scoreFactors().map((factor) {
    final max = factor['max'] as int;
    final record = byId[factor['id']];
    final rawEarned = record is Map ? (record['earned'] ?? 0) : 0;
    final earned = ((rawEarned is num) ? rawEarned.toInt() : 0).clamp(0, max);
    final rawTrend = record is Map ? (record['trend'] ?? 0) : 0;

    return {
      'id': factor['id'],
      'icon': factor['icon'],
      'label': factor['label'],
      'explain': factor['explain'],
      'max': max,
      'earned': earned,
      'share': max == 0 ? 0.0 : earned / max,
      'detail': record is Map
          ? (record['detail'] ?? 'No activity yet')
          : 'No activity yet',
      'trend': (rawTrend is num) ? rawTrend.toInt() : 0,
    };
  }).toList();
}

/// FF: vyapaarMonthlyChange(List<dynamic>? activity) -> int
int vyapaarMonthlyChange(List<dynamic>? activity) {
  var sum = 0;
  for (final entry in (activity ?? [])) {
    final trend = entry is Map ? (entry['trend'] ?? 0) : 0;
    if (trend is num) sum += trend.toInt();
  }
  return sum;
}

// ═════════════════════════════════════════════════════════════════════════════
// Bands
//
// Bands describe platform standing only — they are not lending decisions, and
// the summary text must never imply one.
// ═════════════════════════════════════════════════════════════════════════════

/// FF: vyapaarBandLabel(int score) -> String
String vyapaarBandLabel(int score) {
  if (score >= 750) return 'Strong';
  if (score >= 650) return 'Established';
  if (score >= 500) return 'Building';
  return 'New';
}

/// FF: vyapaarBandSummary(int score) -> String
String vyapaarBandSummary(int score) {
  if (score >= 750) return 'Well above what most partner lenders look for.';
  if (score >= 650) return 'A solid trading record that lenders can verify.';
  if (score >= 500) return 'Enough history to start; more months will help.';
  return 'Keep trading — the score fills in as records build.';
}

/// FF: vyapaarBandTone(int score) -> String
/// Returns a theme colour name from 01-DESIGN-SYSTEM.md, not a hex value.
String vyapaarBandTone(int score) {
  if (score >= 650) return 'leaf';
  if (score >= 500) return 'turmeric';
  return 'terracotta';
}

/// FF: vyapaarGaugeFraction(int score) -> double
/// 0–1 for the arc, measured from the 300 floor rather than from zero. An arc
/// starting at zero would show every new vendor as one third full for reasons
/// they had no part in.
double vyapaarGaugeFraction(int score) {
  final span = kMaxScore - kBaseScore;
  final over = (score - kBaseScore).clamp(0, span);
  return over / span;
}

/// FF: vyapaarUnlocks(int score) -> List<dynamic>   [JSON]
///
/// What a stronger score actually changes on Apna Mandi. These are platform
/// features we control, not third-party credit terms we cannot promise.
List<dynamic> vyapaarUnlocks(int score) => [
      {
        'at': 500,
        'icon': 'schedule',
        'label': 'Pay suppliers 7 days after delivery',
        'unlocked': score >= 500,
      },
      {
        'at': 650,
        'icon': 'groups',
        'label': 'Lead a Mandi Pool and set its terms',
        'unlocked': score >= 650,
      },
      {
        'at': 750,
        'icon': 'account_balance',
        'label': 'Share your record with partner lenders',
        'unlocked': score >= 750,
      },
    ];
