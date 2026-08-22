import { describe, expect, it } from 'vitest';
import { chunkForSpeech } from './VoiceContext';
import { spokenEarnings, spokenGig } from '../utils/speech';

// Chrome stops producing audio partway through a long utterance and fires no
// end or error event — a 1,788-character string sat in `start` for 25 seconds
// with no completion. Chunking is what prevents that, so it is worth pinning.
const MAX = 160;

describe('chunking for speech', () => {
  it('leaves short text alone', () => {
    expect(chunkForSpeech('750 rupees for the shift.')).toEqual(['750 rupees for the shift.']);
  });

  it('returns nothing for empty input', () => {
    expect(chunkForSpeech('')).toEqual([]);
    expect(chunkForSpeech(null)).toEqual([]);
    expect(chunkForSpeech(undefined)).toEqual([]);
  });

  it('keeps every chunk under the limit, however long the text', () => {
    const long = Array.from({ length: 90 }, (_, i) => `sentence number ${i}.`).join(' ');
    const chunks = chunkForSpeech(long);
    expect(chunks.length).toBeGreaterThan(1);
    for (const chunk of chunks) expect(chunk.length).toBeLessThanOrEqual(MAX);
  });

  it('splits a single over-long sentence that has no full stops', () => {
    const runOn = 'word '.repeat(120).trim();
    const chunks = chunkForSpeech(runOn);
    for (const chunk of chunks) expect(chunk.length).toBeLessThanOrEqual(MAX);
  });

  it('loses no words', () => {
    const text = 'First sentence here. Second sentence follows. Third one closes it out.';
    const rejoined = chunkForSpeech(text, 30).join(' ').replace(/\s+/g, ' ');
    expect(rejoined).toBe(text);
  });

  it('does not emit empty chunks', () => {
    const chunks = chunkForSpeech('One.   Two.    Three.', 10);
    expect(chunks.every((c) => c.trim().length > 0)).toBe(true);
  });

  it('prefers breaking at sentence ends', () => {
    const chunks = chunkForSpeech('Alpha beta gamma. Delta epsilon zeta.', 20);
    expect(chunks[0]).toBe('Alpha beta gamma.');
  });

  it('handles the real summaries the app actually speaks', () => {
    const gig = {
      title: 'Chinese Wok Master for Peak Hours',
      vendor: 'Spice Garden',
      vendorLocation: 'Bandra Market',
      date: 'Today',
      time: '7:00 PM - 10:00 PM',
      totalPay: 900,
      rate: 300,
      distance: '400m away',
      skills: ['Wok Cooking', 'Chinese Cuisine', 'High Heat Cooking'],
    };
    for (const chunk of chunkForSpeech(spokenGig(gig))) {
      expect(chunk.length).toBeLessThanOrEqual(MAX);
    }

    const earnings = {
      totalPaid: 3190, pendingAmount: 900, shiftCount: 5,
      averagePerHour: 188, averageRating: 4.8,
    };
    for (const chunk of chunkForSpeech(spokenEarnings(earnings))) {
      expect(chunk.length).toBeLessThanOrEqual(MAX);
    }
  });
});
