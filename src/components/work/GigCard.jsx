import React from 'react';
import Icon from '../AppIcon';
import Image from '../AppImage';
import { GIG_TYPES, URGENCY } from '../../data/gigs';

/**
 * One posted gig. Shared by the karigar's job search and the vendor's hiring
 * board — `perspective` decides whether the footer offers to apply or to review
 * applicants, since the card itself is the same record either way.
 */
const GigCard = ({ gig, perspective = 'karigar', applied = false, onApply, onOpen }) => {
  const type = GIG_TYPES[gig.gigType] ?? GIG_TYPES.prep;
  const urgency = URGENCY[gig.urgency] ?? URGENCY.low;

  return (
    <article className="card-warm overflow-hidden flex flex-col">
      <button
        type="button"
        onClick={() => onOpen?.(gig)}
        className="text-left flex gap-3.5 p-4 hover:bg-paper-dark/20 transition-colors"
      >
        <div className="relative w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 bg-paper-dark">
          <Image src={gig.foodImage} alt="" className="w-full h-full object-cover" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <h3 className="font-bold text-[15px] text-ink leading-snug flex-1">{gig.title}</h3>
            <div className="text-right flex-shrink-0">
              <div className="font-display font-extrabold text-xl text-leaf-dark leading-none">
                ₹{gig.totalPay.toLocaleString('en-IN')}
              </div>
              <div className="text-ink-medium text-[10px] font-semibold mt-0.5">
                ₹{gig.rate}/hr
              </div>
            </div>
          </div>

          <p className="text-ink-medium text-xs mt-1 flex items-center gap-1 flex-wrap">
            <span className="font-semibold text-ink-light">{gig.vendor}</span>
            <span aria-hidden>·</span>
            <Icon name="MapPin" size={11} />
            {gig.vendorLocation}
            <span aria-hidden>·</span>
            {gig.distance}
          </p>

          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full ${type.tint}`}
            >
              <Icon name={type.icon} size={10} />
              {type.label}
            </span>
            <span
              className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${urgency.chip}`}
            >
              <span className={`w-[5px] h-[5px] rounded-full ${urgency.dot}`} />
              {urgency.label}
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-ink-medium">
              <Icon name="Clock" size={10} />
              {gig.date} · {gig.time}
            </span>
          </div>
        </div>
      </button>

      <footer className="flex items-center justify-between gap-3 px-4 py-2.5 border-t border-paper-dark/60 bg-paper/40">
        <span className="text-[11px] font-semibold text-ink-medium flex items-center gap-1.5">
          <Icon name="Users" size={12} />
          {gig.applicants} {gig.applicants === 1 ? 'applicant' : 'applicants'}
          <span aria-hidden>·</span>
          {gig.postedAt}
        </span>

        {perspective === 'karigar' ? (
          applied ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-leaf-dark">
              <Icon name="Check" size={14} />
              Applied
            </span>
          ) : (
            <button
              type="button"
              onClick={() => onApply?.(gig)}
              className="press text-xs font-bold text-white bg-terracotta px-3.5 py-1.5 rounded-lg hover:bg-terracotta-dark transition-colors"
            >
              Apply
            </button>
          )
        ) : gig.applicants > 0 ? (
          <button
            type="button"
            onClick={() => onOpen?.(gig)}
            className="press text-xs font-bold text-terracotta-dark hover:text-terracotta transition-colors inline-flex items-center gap-1"
          >
            Review applicants
            <Icon name="ArrowRight" size={12} />
          </button>
        ) : (
          // Offering a "review applicants" button on a gig nobody has applied
          // to leads to an empty screen; say so here instead.
          <span className="text-[11px] font-semibold text-ink-medium">
            Waiting for applicants
          </span>
        )}
      </footer>
    </article>
  );
};

export default GigCard;
