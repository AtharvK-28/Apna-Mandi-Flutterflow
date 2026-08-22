// Vyapaar Readiness Score.
//
// Deliberately NOT a credit score. In India a credit score is issued by an
// RBI-licensed credit information company (CIBIL, Experian, Equifax, CRIF) from
// regulated bureau data. Apna Mandi has no such licence and no bureau feed, so
// this measures something narrower and honest: how much verifiable trading
// history a vendor has built on this platform.
//
// It is computed from the vendor's own activity — every band below maps to a
// countable event, so a vendor can always see why the number moved. Nothing here
// constitutes an offer of credit; lender eligibility is checked by the lender.

export const MAX_SCORE = 900;
export const BASE_SCORE = 300; // Everyone starts here on their first order.

// Each factor caps at `max`, so no single behaviour can carry the whole score.
export const SCORE_FACTORS = [
  {
    id: 'procurement',
    icon: 'ShoppingCart',
    label: 'Buying regularly',
    explain: 'Supplier orders placed and paid for, weighted towards a steady weekly rhythm.',
    max: 180,
  },
  {
    id: 'gig-payments',
    icon: 'Wrench',
    label: 'Paying karigars on time',
    explain: 'Gigs settled within the agreed window, with no unresolved disputes.',
    max: 150,
  },
  {
    id: 'exchange',
    icon: 'RefreshCw',
    label: 'Trading on the Exchange',
    explain: 'Completed surplus trades with nearby stalls, both sides confirming.',
    max: 120,
  },
  {
    id: 'ratings',
    icon: 'Star',
    label: 'Customer ratings',
    explain: 'Average rating across verified orders over the last 90 days.',
    max: 90,
  },
  {
    id: 'hygiene',
    icon: 'ShieldCheck',
    label: 'Swachh hygiene grade',
    explain: 'Current grade from your most recent verified hygiene audit.',
    max: 60,
  },
];

// The demo vendor's actual activity. A real deployment reads these counts from
// order, payment and rating records rather than a constant.
export const DEMO_ACTIVITY = {
  procurement: { earned: 148, detail: '47 orders paid, steady weekly cycle', trend: +12 },
  'gig-payments': { earned: 132, detail: '12 gigs settled on time, no disputes', trend: +18 },
  exchange: { earned: 74, detail: '23 trades completed with nearby stalls', trend: +4 },
  ratings: { earned: 76, detail: '4.9 average across 340 verified orders', trend: 0 },
  hygiene: { earned: 48, detail: 'Grade A, audited March 2026', trend: 0 },
};

export const computeScore = (activity = DEMO_ACTIVITY) => {
  const breakdown = SCORE_FACTORS.map((factor) => {
    const record = activity[factor.id] ?? { earned: 0, detail: 'No activity yet', trend: 0 };
    // Clamp so bad data can never inflate a score past a factor's ceiling.
    const earned = Math.max(0, Math.min(record.earned, factor.max));
    return { ...factor, ...record, earned, share: earned / factor.max };
  });

  const total = breakdown.reduce((sum, f) => sum + f.earned, 0);
  const score = Math.min(BASE_SCORE + total, MAX_SCORE);
  const monthlyChange = breakdown.reduce((sum, f) => sum + (f.trend ?? 0), 0);

  return { score, breakdown, monthlyChange };
};

// Bands describe platform standing only — they are not lending decisions.
export const BANDS = [
  { min: 750, label: 'Strong', tone: 'leaf', summary: 'Well above what most partner lenders look for.' },
  { min: 650, label: 'Established', tone: 'leaf', summary: 'A solid trading record that lenders can verify.' },
  { min: 500, label: 'Building', tone: 'turmeric', summary: 'Enough history to start; more months will help.' },
  { min: 0, label: 'New', tone: 'terracotta', summary: 'Keep trading — the score fills in as records build.' },
];

export const bandFor = (score) => BANDS.find((band) => score >= band.min) ?? BANDS[BANDS.length - 1];

// What a stronger score actually changes on Apna Mandi. These are platform
// features we control, not third-party credit terms we cannot promise.
export const UNLOCKS = [
  { at: 500, icon: 'Clock', label: 'Pay suppliers 7 days after delivery' },
  { at: 650, icon: 'Users', label: 'Lead a Mandi Pool and set its terms' },
  { at: 750, icon: 'Landmark', label: 'Share your record with partner lenders' },
];
