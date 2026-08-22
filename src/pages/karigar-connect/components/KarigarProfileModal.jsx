import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Modal from '../../../components/ui/Modal';
import { HunarBadge } from './HunarCertificate';

/**
 * A karigar's profile as a vendor sees it, with the message composer inline.
 * Viewing someone and then opening a second modal to write to them was two
 * dialogs for one intent.
 */
const KarigarProfileModal = ({ karigar, onClose, onSendMessage, onViewCertificate }) => {
  const [draft, setDraft] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = (event) => {
    event.preventDefault();
    const body = draft.trim();
    if (!body) return;
    onSendMessage(karigar, body);
    setDraft('');
    setSent(true);
  };

  return (
    <Modal
      title={karigar.name}
      description={`${karigar.location} · ${karigar.distance}`}
      onClose={onClose}
      size="wide"
    >
      <div className="grid sm:grid-cols-[180px_1fr] gap-5">
        <div>
          <div className="relative rounded-2xl overflow-hidden bg-paper-dark aspect-square">
            <Image src={karigar.image} alt="" className="w-full h-full object-cover" />
            {karigar.online && (
              <span className="absolute top-2 right-2 inline-flex items-center gap-1 bg-leaf-dark text-white text-[10px] font-extrabold px-2 py-1 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Online
              </span>
            )}
          </div>

          <div className="mt-3 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-medium">Rate</span>
              <span className="font-display font-bold text-ink">₹{karigar.hourlyRate}/hr</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-medium">Rating</span>
              <span className="font-bold text-ink flex items-center gap-1">
                <Icon name="Star" size={12} className="text-turmeric-dark" />
                {karigar.rating ?? 'New'}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-medium">Shifts done</span>
              <span className="font-bold text-ink">{karigar.totalGigs}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-ink-medium">Available</span>
              <span className="font-bold text-ink text-right">{karigar.availability}</span>
            </div>
          </div>
        </div>

        <div className="min-w-0">
          {karigar.verifiedSkills?.length > 0 && (
            <div className="mb-4">
              <HunarBadge karigar={karigar} onClick={() => onViewCertificate(karigar)} />
            </div>
          )}

          <p className="text-sm text-ink-light leading-relaxed mb-4">{karigar.bio}</p>

          <div className="mb-5">
            <p className="text-[11px] font-semibold text-ink-medium uppercase tracking-wide mb-2">
              Skills
            </p>
            <div className="flex flex-wrap gap-1.5">
              {karigar.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-[11px] font-semibold text-ink-light bg-paper border border-paper-dark px-2.5 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {karigar.skillImage && (
            <div className="rounded-2xl overflow-hidden h-32 bg-paper-dark mb-5">
              <Image src={karigar.skillImage} alt="" className="w-full h-full object-cover" />
            </div>
          )}

          <form onSubmit={handleSend}>
            <label
              htmlFor="karigar-message"
              className="block text-[11px] font-semibold text-ink-medium uppercase tracking-wide mb-2"
            >
              Message {karigar.name.split(' ')[0]}
            </label>
            <textarea
              id="karigar-message"
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                setSent(false);
              }}
              rows={3}
              placeholder={`Hi ${karigar.name.split(' ')[0]}, are you free this evening for a 5-hour shift?`}
              className="w-full px-3 py-2.5 border border-paper-dark rounded-xl bg-paper text-sm text-ink placeholder:text-ink-medium resize-none focus:outline-none focus:ring-2 focus:ring-terracotta/40"
            />
            <div className="flex items-center justify-between gap-3 mt-2.5">
              {sent ? (
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-leaf-dark">
                  <Icon name="Check" size={14} />
                  Message sent
                </span>
              ) : (
                <span className="text-xs text-ink-medium">
                  They usually reply within an hour.
                </span>
              )}
              <button
                type="submit"
                disabled={!draft.trim()}
                className="press inline-flex items-center gap-2 text-sm font-bold text-white bg-terracotta px-4 py-2.5 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed hover:bg-terracotta-dark transition-colors"
              >
                <Icon name="Send" size={15} />
                Send
              </button>
            </div>
          </form>
        </div>
      </div>
    </Modal>
  );
};

export default KarigarProfileModal;
