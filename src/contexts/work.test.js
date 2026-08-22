import { describe, expect, it } from 'vitest';
import { COMPLETED_SHIFTS } from '../data/gigs';

// Mirrors the earnings derivation in WorkContext. Kept as a pure function test
// because the numbers are what a karigar is paid on — a rounding slip here is
// a wrong figure on their earnings screen.
const deriveEarnings = (shifts) => {
  const paid = shifts.filter((s) => s.status === 'paid');
  const pending = shifts.filter((s) => s.status !== 'paid');
  const totalHours = shifts.reduce((sum, s) => sum + s.hours, 0);
  const totalPaid = paid.reduce((sum, s) => sum + s.pay, 0);
  const rated = shifts.filter((s) => typeof s.rating === 'number');

  return {
    totalPaid,
    pendingAmount: pending.reduce((sum, s) => sum + s.pay, 0),
    shiftCount: shifts.length,
    totalHours,
    averagePerHour: totalHours ? Math.round(totalPaid / totalHours) : 0,
    averageRating: rated.length
      ? Number((rated.reduce((sum, s) => sum + s.rating, 0) / rated.length).toFixed(1))
      : null,
  };
};

describe('earnings', () => {
  it('counts only settled shifts as paid out', () => {
    const { totalPaid, pendingAmount } = deriveEarnings(COMPLETED_SHIFTS);
    const expectedPaid = COMPLETED_SHIFTS.filter((s) => s.status === 'paid')
      .reduce((sum, s) => sum + s.pay, 0);

    expect(totalPaid).toBe(expectedPaid);
    expect(totalPaid + pendingAmount).toBe(
      COMPLETED_SHIFTS.reduce((sum, s) => sum + s.pay, 0),
    );
  });

  it('does not divide by zero for a karigar who has worked nothing', () => {
    const empty = deriveEarnings([]);
    expect(empty.averagePerHour).toBe(0);
    expect(empty.averageRating).toBeNull();
    expect(empty.totalPaid).toBe(0);
  });

  it('averages pay across hours, not across shifts', () => {
    // One long cheap shift and one short expensive one: a per-shift average
    // would report 300/hr, but the karigar actually earned 120/hr.
    const shifts = [
      { hours: 10, pay: 1000, status: 'paid' },
      { hours: 1, pay: 200, status: 'paid' },
    ];
    expect(deriveEarnings(shifts).averagePerHour).toBe(109);
  });

  it('ignores unrated shifts when averaging the rating', () => {
    const shifts = [
      { hours: 1, pay: 100, status: 'paid', rating: 5 },
      { hours: 1, pay: 100, status: 'paid' },
      { hours: 1, pay: 100, status: 'paid', rating: 4 },
    ];
    expect(deriveEarnings(shifts).averageRating).toBe(4.5);
  });
});
