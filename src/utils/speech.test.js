import { describe, expect, it } from 'vitest';
import {
  spokenAmount,
  spokenDistance,
  spokenEarnings,
  spokenGig,
  spokenTime,
} from './speech';

describe('spoken formatting', () => {
  it('says amounts as rupees rather than a symbol', () => {
    // "₹750" is announced as a symbol name or skipped entirely.
    expect(spokenAmount(750)).toBe('750 rupees');
    expect(spokenAmount('₹1,200')).toBe('1,200 rupees');
  });

  it('returns nothing for an unparseable amount instead of "NaN rupees"', () => {
    expect(spokenAmount('abc')).toBe('');
    expect(spokenAmount(undefined)).toBe('');
  });

  it('reads time ranges as speech, not punctuation', () => {
    expect(spokenTime('5:00 PM - 10:00 PM')).toBe('5 PM to 10 PM');
    expect(spokenTime('8:30 AM - 10:00 AM')).toBe('8:30 AM to 10 AM');
  });

  it('expands distance units', () => {
    expect(spokenDistance('200m away')).toBe('200 metres away');
    expect(spokenDistance('1.2 km')).toBe('1.2 kilometres');
  });

  it('handles empty input everywhere without throwing', () => {
    expect(spokenTime('')).toBe('');
    expect(spokenDistance(undefined)).toBe('');
  });
});

describe('spoken summaries', () => {
  const gig = {
    title: 'Evening Chaat Rush',
    vendor: 'Delhi Chaat House',
    vendorLocation: 'Dadar Station West',
    date: 'Saturday',
    time: '6:00 PM - 11:00 PM',
    totalPay: 1000,
    rate: 200,
    distance: '150m away',
    skills: ['Chaat Assembly', 'Speed Service'],
  };

  it('leads with what a karigar needs: what, who, when, how much', () => {
    const spoken = spokenGig(gig);
    expect(spoken).toContain('Evening Chaat Rush');
    expect(spoken).toContain('Delhi Chaat House');
    expect(spoken).toContain('6 PM to 11 PM');
    expect(spoken).toContain('1,000 rupees');
    expect(spoken).toContain('150 metres away');
  });

  it('never speaks the word undefined when a field is missing', () => {
    const sparse = { title: 'Untitled shift', vendor: 'A stall', totalPay: 100, rate: 50 };
    const spoken = spokenGig(sparse);
    expect(spoken).not.toMatch(/undefined|null|NaN/);
  });

  it('summarises earnings including the pending case', () => {
    const spoken = spokenEarnings({
      totalPaid: 3190, pendingAmount: 900, shiftCount: 5, averagePerHour: 188, averageRating: 4.8,
    });
    expect(spoken).toContain('3,190 rupees');
    expect(spoken).toContain('900 rupees');
    expect(spoken).toContain('4.8');
  });

  it('says so plainly when nothing is pending', () => {
    const spoken = spokenEarnings({
      totalPaid: 500, pendingAmount: 0, shiftCount: 1, averagePerHour: 100, averageRating: null,
    });
    expect(spoken).toContain('Nothing is pending');
    expect(spoken).not.toMatch(/undefined|null|NaN/);
  });
});
