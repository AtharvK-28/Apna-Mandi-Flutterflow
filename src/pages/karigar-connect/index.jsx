import React, { useMemo, useState } from 'react';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';
import Input from '../../components/ui/Input';
import PageShell from '../../components/ui/PageShell';
import EmptyState from '../../components/ui/EmptyState';
import VoiceInput from '../../components/ui/VoiceInput';
import GigCard from '../../components/work/GigCard';
import PostGigModal from './components/PostGigModal';
import KarigarProfileModal from './components/KarigarProfileModal';
import ApplicantsModal from './components/ApplicantsModal';
import { HunarBadge, HunarCertificateModal } from './components/HunarCertificate';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../contexts/ToastContext';
import { useWork } from '../../contexts/WorkContext';

/**
 * Karigar Connect, vendor side: post work and find people to do it.
 *
 * This page used to serve both sides of the marketplace at once — a karigar
 * browsing for shifts and a vendor hiring for them shared four tabs, so each
 * saw controls meant for the other. The karigar's half now lives under
 * /karigar/*, and this page is the hiring half only.
 */

const TABS = [
  { id: 'postings', label: 'My postings', icon: 'Briefcase' },
  { id: 'karigars', label: 'Find karigars', icon: 'Users' },
];

const KarigarConnect = () => {
  const { displayName } = useAuth();
  const { gigs, karigars, postGig, sendMessage } = useWork();
  const toast = useToast();
  const [tab, setTab] = useState('postings');
  const [query, setQuery] = useState('');
  const [showPostModal, setShowPostModal] = useState(false);
  const [profileKarigar, setProfileKarigar] = useState(null);
  const [certificateKarigar, setCertificateKarigar] = useState(null);
  const [applicantsGig, setApplicantsGig] = useState(null);
  const [decisions, setDecisions] = useState({});

  // Gigs this vendor posted, newest first. Everything else on the board belongs
  // to other stalls and is not this page's business.
  const myGigs = useMemo(
    () => gigs.filter((gig) => gig.vendor === displayName),
    [displayName, gigs],
  );

  const visibleKarigars = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return karigars;
    return karigars.filter(
      (karigar) =>
        karigar.name.toLowerCase().includes(needle) ||
        karigar.location.toLowerCase().includes(needle) ||
        karigar.skills.some((skill) => skill.toLowerCase().includes(needle)),
    );
  }, [karigars, query]);

  const onlineCount = karigars.filter((k) => k.online).length;
  const totalApplicants = myGigs.reduce((sum, gig) => sum + gig.applicants, 0);

  const handlePostGig = (gig) => {
    postGig(gig);
    setShowPostModal(false);
    setTab('postings');
    toast.success(`"${gig.title}" is live. Karigars nearby can see it now.`);
  };

  const handleSendMessage = (karigar, body) => {
    sendMessage(karigar, body);
    toast.success(`Message sent to ${karigar.name}.`);
  };

  // Applicants are drawn from karigars whose skills overlap the gig, which is
  // the same matching the job board uses to decide who sees a posting.
  const applicantsFor = (gig) =>
    karigars
      .filter((karigar) =>
        karigar.skills.some((skill) =>
          gig.skills.some(
            (needed) =>
              needed.toLowerCase().includes(skill.toLowerCase()) ||
              skill.toLowerCase().includes(needed.toLowerCase()),
          ),
        ),
      )
      .slice(0, gig.applicants);

  const handleConfirmApplicant = (gig, karigar) => {
    setDecisions((prev) => ({ ...prev, [karigar.id]: 'confirmed' }));
    toast.success(`${karigar.name} is confirmed for ${gig.title}.`);
  };

  const handleDeclineApplicant = (gig, karigar) => {
    setDecisions((prev) => ({ ...prev, [karigar.id]: 'declined' }));
  };

  return (
    <PageShell
      title="Hire help"
      documentTitle="Karigar Connect — Apna Mandi"
      subtitle={`${onlineCount} skilled karigars are online near you right now.`}
      actions={
        <button
          type="button"
          onClick={() => setShowPostModal(true)}
          className="press inline-flex items-center gap-2 text-sm font-bold text-white bg-terracotta px-4 py-2.5 rounded-xl hover:bg-terracotta-dark transition-colors"
        >
          <Icon name="Plus" size={16} />
          Post a gig
        </button>
      }
    >
      {/* Tabs */}
      <div
        role="tablist"
        aria-label="Karigar Connect sections"
        className="flex items-center gap-1 bg-paper-light border border-paper-dark rounded-2xl p-1 mb-5 w-fit"
      >
        {TABS.map((item) => (
          <button
            key={item.id}
            role="tab"
            aria-selected={tab === item.id}
            onClick={() => setTab(item.id)}
            className={`press inline-flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl transition-colors ${
              tab === item.id
                ? 'bg-terracotta text-white'
                : 'text-ink-light hover:text-ink hover:bg-paper-dark/50'
            }`}
          >
            <Icon name={item.icon} size={15} />
            {item.label}
            {item.id === 'postings' && myGigs.length > 0 && (
              <span
                className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                  tab === item.id ? 'bg-white/25' : 'bg-paper-dark text-ink-medium'
                }`}
              >
                {myGigs.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {tab === 'postings' && (
        <>
          {myGigs.length > 0 && (
            <div className="card-warm p-4 mb-4 flex items-center gap-3.5">
              <span className="w-11 h-11 rounded-2xl bg-leaf-light text-leaf-dark flex items-center justify-center flex-shrink-0">
                <Icon name="Users" size={20} />
              </span>
              <div className="min-w-0">
                <p className="font-bold text-[15px] text-ink">
                  {totalApplicants} {totalApplicants === 1 ? 'karigar has' : 'karigars have'} applied
                </p>
                <p className="text-xs text-ink-medium mt-0.5">
                  Across {myGigs.length} open {myGigs.length === 1 ? 'posting' : 'postings'}. Open a
                  gig to see who put their hand up.
                </p>
              </div>
            </div>
          )}

          {myGigs.length ? (
            <div className="flex flex-col gap-3">
              {myGigs.map((gig) => (
                <GigCard
                  key={gig.id}
                  gig={gig}
                  perspective="vendor"
                  onOpen={setApplicantsGig}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon="Briefcase"
              title="You haven't posted any work yet"
              description="Describe the shift, set a rate, and karigars within 2 km will see it immediately. Most urgent gigs get their first applicant within the hour."
              action={
                <button
                  type="button"
                  onClick={() => setShowPostModal(true)}
                  className="press inline-flex items-center gap-2 text-sm font-bold text-white bg-terracotta px-4 py-2.5 rounded-xl hover:bg-terracotta-dark transition-colors"
                >
                  <Icon name="Plus" size={15} />
                  Post your first gig
                </button>
              }
            />
          )}
        </>
      )}

      {tab === 'karigars' && (
        <>
          <div className="mb-4 flex items-center gap-2">
            <div className="flex-1">
              <Input
                type="search"
                placeholder="Search by name, skill or area"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search karigars"
              />
            </div>
            <VoiceInput label="a search" onTranscript={setQuery} onInterim={setQuery} />
          </div>

          {visibleKarigars.length ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {visibleKarigars.map((karigar) => (
                <article key={karigar.id} className="card-warm overflow-hidden flex flex-col">
                  <button
                    type="button"
                    onClick={() => setProfileKarigar(karigar)}
                    className="text-left p-4 flex gap-3 hover:bg-paper-dark/20 transition-colors flex-1"
                  >
                    <div className="relative w-14 h-14 rounded-2xl overflow-hidden bg-paper-dark flex-shrink-0">
                      <Image src={karigar.image} alt="" className="w-full h-full object-cover" />
                      {karigar.online && (
                        <span className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full bg-leaf ring-2 ring-paper-light" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-[15px] text-ink truncate">{karigar.name}</h3>
                      <p className="text-xs text-ink-medium flex items-center gap-1 mt-0.5">
                        <Icon name="Star" size={11} className="text-turmeric-dark" />
                        {karigar.rating ?? 'New'}
                        <span aria-hidden>·</span>
                        {karigar.totalGigs} shifts
                      </p>
                      <p className="text-xs text-ink-medium flex items-center gap-1 mt-0.5">
                        <Icon name="MapPin" size={11} />
                        {karigar.distance}
                      </p>
                      <p className="font-display font-extrabold text-base text-leaf-dark mt-1.5">
                        ₹{karigar.hourlyRate}
                        <span className="text-[11px] font-semibold text-ink-medium">/hr</span>
                      </p>
                    </div>
                  </button>

                  <div className="px-4 pb-3 flex items-center justify-between gap-2">
                    {karigar.verifiedSkills?.length > 0 ? (
                      <HunarBadge
                        karigar={karigar}
                        onClick={() => setCertificateKarigar(karigar)}
                      />
                    ) : (
                      <span className="text-[11px] font-semibold text-ink-medium">
                        {karigar.skills[0]}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => setProfileKarigar(karigar)}
                      className="press text-xs font-bold text-terracotta-dark hover:text-terracotta transition-colors inline-flex items-center gap-1"
                    >
                      View
                      <Icon name="ArrowRight" size={12} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <EmptyState
              icon="SearchX"
              title="Nobody matches that search"
              description="Try a broader skill name, or clear the search to see every karigar working near you."
              action={
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="press text-sm font-bold text-white bg-terracotta px-4 py-2.5 rounded-xl hover:bg-terracotta-dark transition-colors"
                >
                  Clear search
                </button>
              }
            />
          )}
        </>
      )}

      {showPostModal && (
        <PostGigModal onClose={() => setShowPostModal(false)} onSubmit={handlePostGig} />
      )}

      {profileKarigar && (
        <KarigarProfileModal
          karigar={profileKarigar}
          onClose={() => setProfileKarigar(null)}
          onSendMessage={handleSendMessage}
          onViewCertificate={(karigar) => {
            setProfileKarigar(null);
            setCertificateKarigar(karigar);
          }}
        />
      )}

      {applicantsGig && (
        <ApplicantsModal
          gig={applicantsGig}
          applicants={applicantsFor(applicantsGig)}
          decisions={decisions}
          onConfirm={handleConfirmApplicant}
          onDecline={handleDeclineApplicant}
          onClose={() => setApplicantsGig(null)}
        />
      )}

      {certificateKarigar && (
        <HunarCertificateModal
          karigar={certificateKarigar}
          onClose={() => setCertificateKarigar(null)}
        />
      )}

    </PageShell>
  );
};

export default KarigarConnect;
