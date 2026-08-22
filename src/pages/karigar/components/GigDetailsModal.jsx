import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Modal from '../../../components/ui/Modal';
import SpeakButton from '../../../components/ui/SpeakButton';
import { GIG_TYPES, URGENCY } from '../../../data/gigs';
import { spokenGig } from '../../../utils/speech';

const Fact = ({ icon, label, value }) => (
  <div className="flex items-start gap-2.5">
    <span className="w-8 h-8 rounded-xl bg-paper-dark/60 text-ink-light flex items-center justify-center flex-shrink-0">
      <Icon name={icon} size={15} />
    </span>
    <div className="min-w-0">
      <p className="text-[11px] font-semibold text-ink-medium uppercase tracking-wide">{label}</p>
      <p className="text-sm font-bold text-ink leading-snug">{value}</p>
    </div>
  </div>
);

const GigDetailsModal = ({ gig, applied, onApply, onClose }) => {
  const type = GIG_TYPES[gig.gigType] ?? GIG_TYPES.prep;
  const urgency = URGENCY[gig.urgency] ?? URGENCY.low;

  return (
    <Modal
      title={gig.title}
      description={`Posted by ${gig.vendor} · ${gig.postedAt}`}
      onClose={onClose}
      footer={
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="font-display font-extrabold text-2xl text-leaf-dark leading-none">
              ₹{gig.totalPay.toLocaleString('en-IN')}
            </p>
            <p className="text-[11px] font-semibold text-ink-medium mt-1">
              ₹{gig.rate}/hr · {gig.duration}
            </p>
          </div>
          {applied ? (
            <span className="inline-flex items-center gap-1.5 text-sm font-bold text-leaf-dark bg-leaf-light px-4 py-2.5 rounded-xl">
              <Icon name="Check" size={16} />
              Application sent
            </span>
          ) : (
            <button
              type="button"
              onClick={() => onApply(gig)}
              className="press inline-flex items-center gap-2 text-sm font-bold text-white bg-terracotta px-5 py-2.5 rounded-xl hover:bg-terracotta-dark transition-colors"
            >
              Apply for this shift
              <Icon name="ArrowRight" size={15} />
            </button>
          )}
        </div>
      }
    >
      {/* Read-aloud sits at the top of the dialog: the point is to hear the
          shift without reading it, so it must not be buried below the fold. */}
      <div className="flex items-center gap-2.5 mb-4 p-3 bg-paper border border-paper-dark rounded-xl">
        <SpeakButton id={`gig-${gig.id}`} text={spokenGig(gig)} label="this shift" />
        <p className="text-xs text-ink-medium leading-relaxed">
          Listen to the pay, timing and location instead of reading them.
        </p>
      </div>

      <div className="rounded-2xl overflow-hidden h-40 bg-paper-dark mb-4">
        <Image src={gig.foodImage} alt="" className="w-full h-full object-cover" />
      </div>

      <div className="flex items-center gap-2 flex-wrap mb-4">
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full ${type.tint}`}
        >
          <Icon name={type.icon} size={11} />
          {type.label}
        </span>
        <span
          className={`inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full border ${urgency.chip}`}
        >
          <span className={`w-[5px] h-[5px] rounded-full ${urgency.dot}`} />
          {urgency.label}
        </span>
      </div>

      <p className="text-sm text-ink-light leading-relaxed mb-5">{gig.description}</p>

      <div className="grid grid-cols-2 gap-4 mb-5">
        <Fact icon="Calendar" label="When" value={`${gig.date}, ${gig.time}`} />
        <Fact icon="Clock" label="Duration" value={gig.duration} />
        <Fact icon="MapPin" label="Where" value={`${gig.vendorLocation} · ${gig.distance}`} />
        <Fact icon="Users" label="Applicants" value={`${gig.applicants} so far`} />
      </div>

      <div className="mb-5">
        <p className="text-[11px] font-semibold text-ink-medium uppercase tracking-wide mb-2">
          Skills needed
        </p>
        <div className="flex flex-wrap gap-1.5">
          {gig.skills.map((skill) => (
            <span
              key={skill}
              className="text-[11px] font-semibold text-ink-light bg-paper border border-paper-dark px-2.5 py-1 rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="card-warm p-3.5 flex items-center gap-3">
        <span className="w-10 h-10 rounded-xl bg-terracotta-light text-terracotta-dark flex items-center justify-center flex-shrink-0">
          <Icon name="Store" size={18} />
        </span>
        <div className="min-w-0 flex-1">
          <p className="font-bold text-sm text-ink truncate">{gig.vendor}</p>
          <p className="text-xs text-ink-medium flex items-center gap-1">
            <Icon name="Star" size={11} className="text-turmeric-dark" />
            {gig.vendorRating} rating
            <span aria-hidden>·</span>
            {gig.vendorLocation}
          </p>
        </div>
        {/* Contact details are released once an application is accepted, so the
            number is shown only to karigars already in conversation. */}
        {applied && (
          <a
            href={`tel:${gig.vendorPhone.replace(/\s/g, '')}`}
            className="press w-9 h-9 rounded-xl bg-leaf-light text-leaf-dark flex items-center justify-center flex-shrink-0"
            aria-label={`Call ${gig.vendor}`}
          >
            <Icon name="Phone" size={16} />
          </a>
        )}
      </div>
    </Modal>
  );
};

export default GigDetailsModal;
