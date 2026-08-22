import React, { useMemo, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import PageShell from '../../../components/ui/PageShell';
import EmptyState from '../../../components/ui/EmptyState';
import VoiceInput from '../../../components/ui/VoiceInput';
import GigCard from '../../../components/work/GigCard';
import GigDetailsModal from '../components/GigDetailsModal';
import { GIG_TYPES } from '../../../data/gigs';
import { useAuth } from '../../../contexts/AuthContext';
import { useToast } from '../../../contexts/ToastContext';
import { useWork } from '../../../contexts/WorkContext';

const FILTERS = [
  { id: 'all', label: 'All work', icon: 'LayoutGrid' },
  ...Object.entries(GIG_TYPES).map(([id, meta]) => ({ id, label: meta.label, icon: meta.icon })),
];

const SORTS = [
  { id: 'urgency', label: 'Most urgent' },
  { id: 'pay', label: 'Highest pay' },
  { id: 'distance', label: 'Nearest' },
];

const URGENCY_ORDER = { high: 0, medium: 1, low: 2 };
const metresFrom = (distance) => parseInt(String(distance).replace(/\D/g, ''), 10) || 0;

const FindWork = () => {
  const { firstName } = useAuth();
  const { gigs, applyForGig, hasAppliedTo } = useWork();
  const toast = useToast();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('urgency');
  const [openGig, setOpenGig] = useState(null);

  const visibleGigs = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const matched = gigs.filter((gig) => {
      const matchesType = filter === 'all' || gig.gigType === filter;
      if (!matchesType) return false;
      if (!needle) return true;
      return (
        gig.title.toLowerCase().includes(needle) ||
        gig.vendor.toLowerCase().includes(needle) ||
        gig.vendorLocation.toLowerCase().includes(needle) ||
        gig.skills.some((skill) => skill.toLowerCase().includes(needle))
      );
    });

    const comparators = {
      urgency: (a, b) => URGENCY_ORDER[a.urgency] - URGENCY_ORDER[b.urgency],
      pay: (a, b) => b.totalPay - a.totalPay,
      distance: (a, b) => metresFrom(a.distance) - metresFrom(b.distance),
    };
    return [...matched].sort(comparators[sort]);
  }, [filter, gigs, query, sort]);

  const handleApply = (gig) => {
    const application = applyForGig(gig);
    setOpenGig(null);
    if (application) {
      toast.success(`Applied to ${gig.title}. ${gig.vendor} will see it straight away.`);
    } else {
      toast.info(`You have already applied to ${gig.title}.`);
    }
  };

  const urgentCount = gigs.filter((g) => g.urgency === 'high').length;

  return (
    <PageShell
      title={firstName ? `Work near you, ${firstName}` : 'Work near you'}
      documentTitle="Find work — Apna Mandi"
      subtitle={
        urgentCount
          ? `${gigs.length} open shifts within 2 km · ${urgentCount} need someone today`
          : `${gigs.length} open shifts within 2 km`
      }
    >
      {/* Search + sort. Dictation matters most here: a karigar looking for work
          is often standing on a street, one-handed, in bright sun. */}
      <div className="flex flex-col sm:flex-row gap-2.5 mb-3">
        <div className="flex-1 flex items-center gap-2">
          <div className="flex-1">
            <Input
              type="search"
              placeholder="Search by skill, stall or area"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search available work"
            />
          </div>
          <VoiceInput label="a search" onTranscript={setQuery} onInterim={setQuery} />
        </div>
        <div className="flex items-center gap-1 bg-paper-light border border-paper-dark rounded-xl p-1">
          {SORTS.map((option) => (
            <button
              key={option.id}
              type="button"
              onClick={() => setSort(option.id)}
              aria-pressed={sort === option.id}
              className={`press text-xs font-bold px-3 py-2 rounded-lg transition-colors ${
                sort === option.id
                  ? 'bg-terracotta text-white'
                  : 'text-ink-light hover:text-ink hover:bg-paper-dark/50'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Type filters */}
      <div className="snap-row mb-5 md:flex md:flex-wrap md:gap-2 md:overflow-visible md:mx-0 md:px-0">
        {FILTERS.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setFilter(option.id)}
            aria-pressed={filter === option.id}
            className={`press inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-full border whitespace-nowrap transition-colors ${
              filter === option.id
                ? 'bg-terracotta text-white border-terracotta'
                : 'bg-paper-light text-ink-light border-paper-dark hover:text-ink'
            }`}
          >
            <Icon name={option.icon} size={13} />
            {option.label}
          </button>
        ))}
      </div>

      {/* Results */}
      {visibleGigs.length ? (
        <div className="flex flex-col gap-3">
          {visibleGigs.map((gig) => (
            <GigCard
              key={gig.id}
              gig={gig}
              perspective="karigar"
              applied={hasAppliedTo(gig.id)}
              onApply={handleApply}
              onOpen={setOpenGig}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="SearchX"
          title="No work matches that"
          description="Try a different skill, widen the filter, or clear your search to see everything open near Dadar."
          action={
            <button
              type="button"
              onClick={() => {
                setQuery('');
                setFilter('all');
              }}
              className="press text-sm font-bold text-white bg-terracotta px-4 py-2.5 rounded-xl hover:bg-terracotta-dark transition-colors"
            >
              Clear filters
            </button>
          }
        />
      )}

      {openGig && (
        <GigDetailsModal
          gig={openGig}
          applied={hasAppliedTo(openGig.id)}
          onApply={handleApply}
          onClose={() => setOpenGig(null)}
        />
      )}

    </PageShell>
  );
};

export default FindWork;
