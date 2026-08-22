import React, { useMemo, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Modal from '../../../components/ui/Modal';
import {
  MAX_SCORE,
  UNLOCKS,
  bandFor,
  computeScore,
} from '../../../data/vyapaar';

/**
 * Vyapaar Readiness Score.
 *
 * This card used to show a hardcoded 712 alongside a "Pre-approved ₹40,000"
 * offer at "1.2%/month via NBFC partner" — with no named lender, no consent step
 * and no terms. That is a credit offer in everything but name, and India's
 * digital lending rules require the regulated lender be identified up front,
 * the rate quoted as an annualised APR, and a Key Fact Statement shown before
 * anyone accepts.
 *
 * So the card no longer pretends to make offers. It reports what Apna Mandi can
 * honestly report — the vendor's own trading record on this platform — and the
 * only lending action is an explicit, revocable consent to share that record
 * with lenders, who make their own decisions.
 */

const TONE = {
  leaf: { stroke: 'stroke-leaf', text: 'text-leaf-dark', chip: 'bg-leaf-light text-leaf-dark' },
  turmeric: {
    stroke: 'stroke-turmeric',
    text: 'text-turmeric-dark',
    chip: 'bg-turmeric-light text-turmeric-dark',
  },
  terracotta: {
    stroke: 'stroke-terracotta',
    text: 'text-terracotta-dark',
    chip: 'bg-terracotta-light text-terracotta-dark',
  },
};

const ScoreGauge = ({ score, max, tone }) => {
  const radius = 54;
  const arc = Math.PI * radius;
  const filled = (score / max) * arc;

  return (
    <svg width="150" height="88" viewBox="0 0 150 88" role="img" aria-label={`${score} out of ${max}`}>
      <path
        d="M 21 76 A 54 54 0 0 1 129 76"
        fill="none"
        strokeWidth="12"
        strokeLinecap="round"
        className="stroke-paper-dark"
      />
      <path
        d="M 21 76 A 54 54 0 0 1 129 76"
        fill="none"
        strokeWidth="12"
        strokeLinecap="round"
        className={`${tone.stroke} transition-[stroke-dasharray] duration-700`}
        strokeDasharray={`${filled} ${arc}`}
      />
      <text
        x="75"
        y="64"
        textAnchor="middle"
        className="fill-ink font-display"
        fontSize="30"
        fontWeight="800"
      >
        {score}
      </text>
      <text x="75" y="81" textAnchor="middle" className="fill-ink-medium" fontSize="10">
        of {max}
      </text>
    </svg>
  );
};

const VyapaarScoreCard = () => {
  const { score, breakdown, monthlyChange } = useMemo(() => computeScore(), []);
  const band = bandFor(score);
  const tone = TONE[band.tone] ?? TONE.terracotta;

  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showConsent, setShowConsent] = useState(false);
  const [consentGiven, setConsentGiven] = useState(false);
  const [consentChecked, setConsentChecked] = useState(false);

  const nextUnlock = UNLOCKS.find((unlock) => score < unlock.at);

  return (
    <section className="card-warm overflow-hidden">
      <header className="px-4 py-3.5 border-b border-paper-dark/60 flex items-start gap-3">
        <span className="w-10 h-10 rounded-xl bg-terracotta-light text-terracotta-dark flex items-center justify-center flex-shrink-0">
          <Icon name="TrendingUp" size={19} />
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="font-display font-bold text-ink">Vyapaar Readiness Score</h2>
            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${tone.chip}`}>
              {band.label}
            </span>
          </div>
          <p className="text-xs text-ink-medium mt-0.5">
            Your trading record on Apna Mandi — built from work you have already done
          </p>
        </div>
      </header>

      <div className="p-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 mb-4">
          <div className="flex-shrink-0">
            <ScoreGauge score={score} max={MAX_SCORE} tone={tone} />
          </div>

          <div className="flex-1 w-full min-w-0">
            <p className="text-sm text-ink-light leading-relaxed">
              <span className={`font-bold ${tone.text}`}>{band.summary}</span>{' '}
              {monthlyChange > 0
                ? `Up ${monthlyChange} points this month, mostly from settling gigs on time.`
                : 'Steady this month.'}
            </p>

            <button
              type="button"
              onClick={() => setShowBreakdown(true)}
              className="press inline-flex items-center gap-1 text-xs font-bold text-terracotta-dark hover:text-terracotta transition-colors mt-2"
            >
              See exactly how it is calculated
              <Icon name="ArrowRight" size={13} />
            </button>
          </div>
        </div>

        {/* What the score changes on Apna Mandi — features we actually control. */}
        {nextUnlock && (
          <div className="bg-paper border border-paper-dark rounded-2xl p-3.5 mb-3">
            <div className="flex items-center gap-3">
              <span className="w-9 h-9 rounded-xl bg-paper-dark/70 text-ink-light flex items-center justify-center flex-shrink-0">
                <Icon name={nextUnlock.icon} size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-ink">{nextUnlock.label}</p>
                <p className="text-xs text-ink-medium mt-0.5">
                  {nextUnlock.at - score} points away
                </p>
              </div>
            </div>
            <div className="h-1.5 rounded-full bg-paper-dark mt-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-terracotta transition-[width] duration-700"
                style={{ width: `${Math.min(100, (score / nextUnlock.at) * 100)}%` }}
              />
            </div>
          </div>
        )}

        {/* Lending is a referral, gated on explicit consent — never an offer. */}
        <div className="bg-paper border border-paper-dark rounded-2xl p-3.5">
          {consentGiven ? (
            <div className="flex items-start gap-3">
              <span className="w-9 h-9 rounded-xl bg-leaf-light text-leaf-dark flex items-center justify-center flex-shrink-0">
                <Icon name="Check" size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-ink">Record shared for review</p>
                <p className="text-xs text-ink-medium mt-0.5 leading-relaxed">
                  RBI-registered lenders on our panel can now see your Apna Mandi trading record.
                  Any offer, its rate and its terms come from the lender directly — Apna Mandi does
                  not lend and does not decide.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setConsentGiven(false);
                    setConsentChecked(false);
                  }}
                  className="press text-xs font-bold text-ink-medium hover:text-chili transition-colors mt-2"
                >
                  Withdraw consent
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-sm font-bold text-ink">Looking for working capital?</p>
                <p className="text-xs text-ink-medium mt-0.5">
                  Share this record with lenders on our panel to see what you qualify for.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowConsent(true)}
                className="press inline-flex items-center gap-1.5 text-sm font-bold text-white bg-terracotta px-4 py-2.5 rounded-xl hover:bg-terracotta-dark transition-colors flex-shrink-0"
              >
                Check eligibility
                <Icon name="ArrowRight" size={15} />
              </button>
            </div>
          )}
        </div>

        <p className="text-[11px] text-ink-medium mt-3 leading-relaxed flex items-start gap-1.5">
          <Icon name="Info" size={12} className="flex-shrink-0 mt-0.5" />
          This is an Apna Mandi platform score, not a credit score. It is not issued by a credit
          information company and does not appear on your CIBIL, Experian, Equifax or CRIF report.
        </p>
      </div>

      {/* Breakdown */}
      {showBreakdown && (
        <Modal
          title="How your score is calculated"
          description={`${score} of ${MAX_SCORE} — 300 base, plus what you have earned below`}
          onClose={() => setShowBreakdown(false)}
        >
          <div className="space-y-4">
            {breakdown.map((factor) => (
              <div key={factor.id}>
                <div className="flex items-center gap-2.5 mb-1.5">
                  <span className="w-8 h-8 rounded-xl bg-paper-dark/60 text-ink-light flex items-center justify-center flex-shrink-0">
                    <Icon name={factor.icon} size={15} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-ink">{factor.label}</p>
                    <p className="text-xs text-ink-medium">{factor.detail}</p>
                  </div>
                  <span className="text-sm font-display font-bold text-ink flex-shrink-0">
                    {factor.earned}
                    <span className="text-xs font-semibold text-ink-medium">/{factor.max}</span>
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-paper-dark overflow-hidden ml-[42px]">
                  <div
                    className="h-full rounded-full bg-leaf"
                    style={{ width: `${factor.share * 100}%` }}
                  />
                </div>
                <p className="text-[11px] text-ink-medium mt-1.5 ml-[42px] leading-relaxed">
                  {factor.explain}
                </p>
              </div>
            ))}
          </div>

          <p className="text-xs text-ink-medium mt-5 pt-4 border-t border-paper-dark/60 leading-relaxed">
            Every point traces back to a countable event — an order paid, a gig settled, a trade
            confirmed. Nothing here is estimated or inferred, and no factor can carry more than its
            ceiling.
          </p>
        </Modal>
      )}

      {/* Consent */}
      {showConsent && (
        <Modal
          title="Share your record with lenders"
          description="Read this before you agree — you can withdraw at any time."
          onClose={() => setShowConsent(false)}
          footer={
            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowConsent(false)}
                className="press text-sm font-bold text-ink-light px-4 py-2.5 rounded-xl border border-paper-dark hover:bg-paper-dark/40 transition-colors"
              >
                Not now
              </button>
              <button
                type="button"
                disabled={!consentChecked}
                onClick={() => {
                  setConsentGiven(true);
                  setShowConsent(false);
                }}
                className="press text-sm font-bold text-white bg-terracotta px-5 py-2.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-terracotta-dark transition-colors"
              >
                Agree and share
              </button>
            </div>
          }
        >
          <ul className="space-y-3 text-sm text-ink-light">
            {[
              {
                icon: 'Building2',
                text: 'Apna Mandi is not a lender. We do not issue credit, set rates or approve applications. Only RBI-registered banks and NBFCs on our panel do that.',
              },
              {
                icon: 'FileText',
                text: 'We share your Apna Mandi trading record: order history, gig payment punctuality, exchange trades and ratings. We do not share your customers, recipes or bank balances.',
              },
              {
                icon: 'Percent',
                text: 'Any offer you receive comes with the lender named, the cost shown as an annualised APR, and a Key Fact Statement you must read before accepting.',
              },
              {
                icon: 'ShieldCheck',
                text: 'Sharing this record does not affect your CIBIL, Experian, Equifax or CRIF score. Lenders may run their own bureau check later, and will tell you before they do.',
              },
              {
                icon: 'Undo2',
                text: 'You can withdraw consent at any time from this card. Lenders stop receiving updates immediately.',
              },
            ].map((item) => (
              <li key={item.icon} className="flex items-start gap-3">
                <span className="w-8 h-8 rounded-xl bg-paper-dark/60 text-ink-light flex items-center justify-center flex-shrink-0">
                  <Icon name={item.icon} size={15} />
                </span>
                <span className="leading-relaxed">{item.text}</span>
              </li>
            ))}
          </ul>

          <label className="flex items-start gap-3 mt-5 pt-4 border-t border-paper-dark/60 cursor-pointer">
            <input
              type="checkbox"
              checked={consentChecked}
              onChange={(e) => setConsentChecked(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-paper-dark text-terracotta focus:ring-2 focus:ring-terracotta/40"
            />
            <span className="text-sm text-ink leading-relaxed">
              I have read the above and consent to Apna Mandi sharing my trading record with
              lenders on its panel.
            </span>
          </label>
        </Modal>
      )}
    </section>
  );
};

export default VyapaarScoreCard;
