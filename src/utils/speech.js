/**
 * Turning screen text into text worth hearing.
 *
 * Reading the UI verbatim gives poor results: "₹750" is announced as a symbol
 * or dropped entirely, "5:00 PM - 10:00 PM" becomes "five colon zero zero",
 * and "1.2km" runs together. These helpers produce a sentence a person would
 * actually say, which is what gets passed to speechSynthesis.
 */

/** "₹1,200" / 1200 → "1,200 rupees" */
export const spokenAmount = (value) => {
  if (value === null || value === undefined || value === '') return '';
  if (typeof value === 'number') {
    return Number.isFinite(value) ? `${value.toLocaleString('en-IN')} rupees` : '';
  }
  // Stripping non-digits from a non-numeric string leaves '', and Number('')
  // is 0 — which would announce a missing price as "0 rupees".
  const digits = String(value).replace(/[^\d.]/g, '');
  if (!digits) return '';
  const number = Number(digits);
  return Number.isFinite(number) ? `${number.toLocaleString('en-IN')} rupees` : '';
};

/** "5:00 PM - 10:00 PM" → "5 PM to 10 PM"; ":30" is kept as "5:30 PM". */
export const spokenTime = (value) => {
  if (!value) return '';
  return String(value)
    .replace(/\s*[-–—]\s*/g, ' to ')
    .replace(/(\d{1,2}):00/g, '$1')
    .replace(/\s+/g, ' ')
    .trim();
};

/** "200m away" → "200 metres away"; "1.2 km" → "1.2 kilometres" */
export const spokenDistance = (value) => {
  if (!value) return '';
  return String(value)
    .replace(/(\d)\s*km\b/gi, '$1 kilometres')
    .replace(/(\d)\s*m\b/gi, '$1 metres')
    .trim();
};

/** Drops empty parts so a missing field never becomes a spoken "undefined". */
const sentence = (...parts) => parts.filter(Boolean).join('. ').replace(/\.\./g, '.') + '.';

/** What a karigar needs to hear about a shift, in the order they need it. */
export const spokenGig = (gig) => {
  // Every part is built only from fields that exist. Interpolating a missing
  // one straight into the template made the voice say "undefined".
  const when = [gig.date, spokenTime(gig.time)].filter(Boolean).join(', ');
  const pay = [
    gig.totalPay ? `${spokenAmount(gig.totalPay)} for the shift` : '',
    gig.rate ? `${spokenAmount(gig.rate)} per hour` : '',
  ]
    .filter(Boolean)
    .join(', ');
  const where = [spokenDistance(gig.distance), gig.vendorLocation && `at ${gig.vendorLocation}`]
    .filter(Boolean)
    .join(', ');

  return sentence(
    gig.title,
    gig.vendor && `Posted by ${gig.vendor}`,
    when,
    pay,
    where,
    gig.skills?.length ? `Skills needed: ${gig.skills.join(', ')}` : '',
  );
};

/** A karigar's earnings summary — the numbers they check most often. */
export const spokenEarnings = (earnings) =>
  sentence(
    `You have been paid ${spokenAmount(earnings.totalPaid)} across ${earnings.shiftCount} shifts`,
    earnings.pendingAmount
      ? `${spokenAmount(earnings.pendingAmount)} is still being processed`
      : 'Nothing is pending',
    `That averages ${spokenAmount(earnings.averagePerHour)} per hour`,
    earnings.averageRating ? `Your average rating is ${earnings.averageRating} out of 5` : '',
  );

/** An order's current state, for a vendor whose hands are busy. */
export const spokenOrder = (order) =>
  sentence(
    `Order ${String(order.orderId ?? order.id).replace('#', 'number ')}`,
    `from ${order.supplierName}`,
    `Status: ${order.status}`,
    order.totalAmount ? `Total ${spokenAmount(order.totalAmount)}` : '',
    order.estimatedDelivery ? `Arriving in about ${order.estimatedDelivery}` : '',
  );
