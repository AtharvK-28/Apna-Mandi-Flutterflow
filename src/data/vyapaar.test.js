import { describe, expect, it } from 'vitest';
import {
  BASE_SCORE,
  DEMO_ACTIVITY,
  MAX_SCORE,
  SCORE_FACTORS,
  UNLOCKS,
  bandFor,
  computeScore,
} from './vyapaar';

describe('score arithmetic', () => {
  it('is the base plus what was earned', () => {
    const { score, breakdown } = computeScore();
    const earned = breakdown.reduce((sum, f) => sum + f.earned, 0);
    expect(score).toBe(BASE_SCORE + earned);
  });

  it('cannot exceed the maximum even if every factor is maxed', () => {
    const perfect = Object.fromEntries(
      SCORE_FACTORS.map((f) => [f.id, { earned: f.max, detail: '', trend: 0 }]),
    );
    expect(computeScore(perfect).score).toBeLessThanOrEqual(MAX_SCORE);
  });

  it('clamps a factor that reports more than its ceiling', () => {
    const inflated = { ...DEMO_ACTIVITY, procurement: { earned: 99999, detail: '', trend: 0 } };
    const factor = computeScore(inflated).breakdown.find((f) => f.id === 'procurement');
    expect(factor.earned).toBe(SCORE_FACTORS.find((f) => f.id === 'procurement').max);
  });

  it('clamps a negative factor to zero rather than subtracting', () => {
    const negative = { ...DEMO_ACTIVITY, ratings: { earned: -500, detail: '', trend: 0 } };
    const result = computeScore(negative);
    expect(result.breakdown.find((f) => f.id === 'ratings').earned).toBe(0);
    expect(result.score).toBeGreaterThanOrEqual(BASE_SCORE);
  });

  it('reports the base score for a brand-new vendor with no activity', () => {
    expect(computeScore({}).score).toBe(BASE_SCORE);
  });

  it('reports a share between 0 and 1 for every factor', () => {
    for (const factor of computeScore().breakdown) {
      expect(factor.share).toBeGreaterThanOrEqual(0);
      expect(factor.share).toBeLessThanOrEqual(1);
    }
  });
});

describe('bands', () => {
  it('always resolves to a band, including at the extremes', () => {
    for (const score of [0, 1, 299, 300, 499, 500, 649, 650, 749, 750, MAX_SCORE]) {
      expect(bandFor(score), `no band for ${score}`).toBeTruthy();
    }
  });

  it('never describes the score as a credit score', () => {
    const wording = [
      ...SCORE_FACTORS.flatMap((f) => [f.label, f.explain]),
      ...UNLOCKS.map((u) => u.label),
    ]
      .join(' ')
      .toLowerCase();

    // Apna Mandi is not an RBI-licensed credit information company, so this
    // must never present itself as a bureau score or as an offer of credit.
    for (const forbidden of ['credit score', 'cibil', 'pre-approved', 'preapproved', 'interest rate']) {
      expect(wording, `wording contains "${forbidden}"`).not.toContain(forbidden);
    }
  });
});
