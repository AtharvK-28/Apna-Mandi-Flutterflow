import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import QrPattern from '../../../components/QrPattern';

const scoreBreakdown = [
  { label: 'Water source & handling', score: 95 },
  { label: 'Storage & refrigeration', score: 90 },
  { label: 'Prep surface & gloves', score: 94 },
  { label: 'Waste disposal', score: 88 }
];

const unlocks = [
  { icon: 'Building2', label: 'Corporate catering orders', unlocked: true },
  { icon: 'Crown', label: 'Virasaat product listing', unlocked: true },
  { icon: 'TrendingUp', label: '+12 points on Vyapaar Score', unlocked: true }
];

const SwachhBadgeCard = ({ vendorName = 'Vendor' }) => {
  const [showQr, setShowQr] = useState(false);
  const overallScore = 92;

  return (
    <div className="bg-paper-light rounded-2xl border border-paper-dark/60 shadow-sm p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-ink-medium uppercase tracking-widest">Swachh Badge</h3>
        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border bg-leaf-light text-leaf-dark border-leaf/30">
          <Icon name="ShieldCheck" size={13} />
          Grade A Certified
        </span>
      </div>

      {/* Score header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-2xl bg-leaf flex flex-col items-center justify-center text-white flex-shrink-0">
          <span className="text-xl font-bold leading-none">{overallScore}</span>
          <span className="text-[10px] opacity-80 mt-0.5">/ 100</span>
        </div>
        <div>
          <p className="text-sm font-semibold text-ink">Hygiene audit passed</p>
          <p className="text-xs text-ink-medium mt-0.5">
            Audited 12 Jun 2026 by a certified Karigar auditor · next refresh Sep 2026
          </p>
        </div>
      </div>

      {/* Breakdown */}
      <div className="space-y-2.5 mb-4">
        {scoreBreakdown.map((row) => (
          <div key={row.label}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium text-ink-light">{row.label}</span>
              <span className="text-xs font-bold text-ink">{row.score}</span>
            </div>
            <div className="h-1.5 bg-paper-dark/50 rounded-full overflow-hidden">
              <div className="h-full bg-leaf rounded-full" style={{ width: `${row.score}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* What it unlocks */}
      <div className="border-t border-paper-dark/60 pt-3 mb-4">
        <p className="text-xs font-semibold text-ink-medium uppercase tracking-wider mb-2">Unlocked by this badge</p>
        <div className="space-y-1.5">
          {unlocks.map((u) => (
            <div key={u.label} className="flex items-center gap-2">
              <Icon name="CheckCircle" size={14} className="text-leaf flex-shrink-0" />
              <span className="text-sm text-ink-light">{u.label}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => setShowQr(true)}
        className="w-full px-4 py-2.5 text-sm font-semibold text-white bg-leaf rounded-xl hover:bg-leaf-dark transition-colors flex items-center justify-center gap-2"
      >
        <Icon name="QrCode" size={16} />
        Show Cart QR for Customers
      </button>

      {/* QR modal */}
      {showQr && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setShowQr(false)}>
          <div className="bg-paper-light rounded-2xl shadow-xl w-full max-w-sm p-6 text-center" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-center gap-2 mb-1">
              <Icon name="ShieldCheck" size={18} className="text-leaf-dark" />
              <h3 className="font-bold text-ink">Swachh Verified Cart</h3>
            </div>
            <p className="text-xs text-ink-medium mb-4">{vendorName} · Grade A · Score {overallScore}/100</p>

            <div className="inline-block p-4 bg-paper-light border-2 border-paper-dark rounded-2xl mb-4">
              <QrPattern seed={`swachh-${vendorName}`} />
            </div>

            <p className="text-xs text-ink-medium leading-relaxed mb-4">
              Print this on your cart. Customers scan it to see your hygiene audit,
              your story, and your Virasaat products — trust that brings them back.
            </p>

            <button
              onClick={() => setShowQr(false)}
              className="w-full px-4 py-2.5 text-sm font-semibold text-ink-light bg-paper-dark/50 rounded-xl hover:bg-paper-dark transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SwachhBadgeCard;
