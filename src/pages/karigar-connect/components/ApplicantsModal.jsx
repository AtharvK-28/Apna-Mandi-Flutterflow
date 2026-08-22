import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Modal from '../../../components/ui/Modal';
import { HunarBadge } from './HunarCertificate';

/**
 * Who has applied to one of the vendor's gigs, and the two decisions they can
 * make about each: confirm them for the shift, or pass.
 */
const ApplicantsModal = ({ gig, applicants, onConfirm, onDecline, onClose, decisions = {} }) => (
  <Modal
    title={`Applicants for ${gig.title}`}
    description={`${gig.date}, ${gig.time} · ₹${gig.totalPay.toLocaleString('en-IN')} for the shift`}
    onClose={onClose}
    size="wide"
  >
    <ul className="space-y-3">
      {applicants.map((karigar) => {
        const decision = decisions[karigar.id];

        return (
          <li key={karigar.id} className="card-warm p-4 flex items-start gap-3.5">
            <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-paper-dark flex-shrink-0">
              <Image src={karigar.image} alt="" className="w-full h-full object-cover" />
              {karigar.online && (
                <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-leaf ring-2 ring-paper-light" />
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-bold text-[15px] text-ink">{karigar.name}</h3>
                {karigar.verifiedSkills?.length > 0 && <HunarBadge karigar={karigar} />}
              </div>

              <p className="text-xs text-ink-medium mt-1 flex items-center gap-1 flex-wrap">
                <Icon name="Star" size={11} className="text-turmeric-dark" />
                {karigar.rating ?? 'New'}
                <span aria-hidden>·</span>
                {karigar.totalGigs} shifts
                <span aria-hidden>·</span>
                <Icon name="MapPin" size={11} />
                {karigar.distance}
                <span aria-hidden>·</span>₹{karigar.hourlyRate}/hr
              </p>

              <div className="flex flex-wrap gap-1.5 mt-2">
                {karigar.skills.slice(0, 3).map((skill) => (
                  <span
                    key={skill}
                    className="text-[10px] font-semibold text-ink-light bg-paper border border-paper-dark px-2 py-0.5 rounded-full"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex-shrink-0">
              {decision === 'confirmed' ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-leaf-dark bg-leaf-light px-3 py-2 rounded-xl">
                  <Icon name="Check" size={14} />
                  Confirmed
                </span>
              ) : decision === 'declined' ? (
                <span className="text-xs font-bold text-ink-medium px-3 py-2">Passed</span>
              ) : (
                <div className="flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => onConfirm(gig, karigar)}
                    className="press text-xs font-bold text-white bg-terracotta px-3.5 py-2 rounded-xl hover:bg-terracotta-dark transition-colors whitespace-nowrap"
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    onClick={() => onDecline(gig, karigar)}
                    className="press text-xs font-bold text-ink-medium hover:text-chili transition-colors"
                  >
                    Pass
                  </button>
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ul>

    <p className="text-xs text-ink-medium mt-4 flex items-start gap-1.5">
      <Icon name="Info" size={13} className="flex-shrink-0 mt-0.5" />
      Confirming shares your stall's exact location and phone number with that karigar so they can
      reach you on the day.
    </p>
  </Modal>
);

export default ApplicantsModal;
