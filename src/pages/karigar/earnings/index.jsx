import React, { useMemo } from 'react';
import Icon from '../../../components/AppIcon';
import PageShell from '../../../components/ui/PageShell';
import SpeakButton from '../../../components/ui/SpeakButton';
import { useWork } from '../../../contexts/WorkContext';
import { spokenEarnings } from '../../../utils/speech';

// Height of the bar-chart plot area, in pixels.
const PLOT_HEIGHT = 150;

const StatTile = ({ icon, tint, value, label, footnote }) => (
  <div className="card-warm p-4">
    <span className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${tint}`}>
      <Icon name={icon} size={18} />
    </span>
    <div className="font-display font-extrabold text-2xl text-ink leading-none">{value}</div>
    <div className="text-ink-medium text-[11px] font-semibold mt-1.5">{label}</div>
    {footnote && <div className="text-ink-medium text-[10px] mt-1">{footnote}</div>}
  </div>
);

const Earnings = () => {
  const { shifts, earnings } = useWork();

  // A plain bar chart of per-shift pay reads better here than a library chart —
  // there are five bars and the shape is the whole point.
  //
  // Bar heights are in pixels against a fixed plot area rather than a
  // percentage: a percentage height needs a parent with a definite height, and
  // inside a flex column it resolves to zero, so no bars drew at all.
  const chart = useMemo(() => {
    const ordered = [...shifts].reverse();
    const peak = Math.max(...ordered.map((s) => s.pay), 1);
    return ordered.map((shift) => ({
      ...shift,
      // A floor of 6px keeps a very small shift visible rather than invisible.
      barHeight: Math.max(6, Math.round((shift.pay / peak) * PLOT_HEIGHT)),
    }));
  }, [shifts]);

  return (
    <PageShell
      title="Earnings"
      subtitle="What you have made through Apna Mandi, and what is still on its way."
      actions={
        <SpeakButton id="earnings-summary" text={spokenEarnings(earnings)} label="your earnings" />
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 mb-6">
        <StatTile
          icon="IndianRupee"
          tint="bg-leaf-light text-leaf-dark"
          value={`₹${earnings.totalPaid.toLocaleString('en-IN')}`}
          label="Paid out"
          footnote={`across ${earnings.shiftCount} shifts`}
        />
        <StatTile
          icon="Hourglass"
          tint="bg-turmeric-light text-turmeric-dark"
          value={`₹${earnings.pendingAmount.toLocaleString('en-IN')}`}
          label="Processing"
          footnote="lands within 48 hrs"
        />
        <StatTile
          icon="Clock"
          tint="bg-terracotta-light text-terracotta-dark"
          value={`₹${earnings.averagePerHour}`}
          label="Average per hour"
          footnote={`${earnings.totalHours} hours worked`}
        />
        <StatTile
          icon="Star"
          tint="bg-chili-light text-chili"
          value={earnings.averageRating ?? '—'}
          label="Average rating"
          footnote={earnings.averageRating ? 'from vendors you worked for' : 'no ratings yet'}
        />
      </div>

      {/* Per-shift pay */}
      <section className="card-warm p-5 mb-6">
        <div className="flex items-baseline justify-between mb-5">
          <h2 className="font-display font-bold text-lg text-ink">Pay per shift</h2>
          <span className="text-xs font-semibold text-ink-medium">Last {chart.length} shifts</span>
        </div>

        <div className="flex items-end justify-between gap-2 sm:gap-4">
          {chart.map((shift) => (
            <div key={shift.id} className="flex-1 flex flex-col items-center gap-2 min-w-0">
              <span className="text-[10px] font-bold text-ink-light">
                ₹{shift.pay.toLocaleString('en-IN')}
              </span>
              <div
                className={`w-full max-w-[64px] rounded-t-lg ${
                  shift.status === 'paid' ? 'bg-leaf' : 'bg-turmeric'
                }`}
                style={{ height: `${shift.barHeight}px` }}
                role="img"
                aria-label={`${shift.date}: ₹${shift.pay.toLocaleString('en-IN')}, ${shift.status}`}
              />
              <span className="text-[10px] font-semibold text-ink-medium truncate w-full text-center">
                {shift.date}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-4 mt-4 pt-4 border-t border-paper-dark/60">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-ink-medium">
            <span className="w-2.5 h-2.5 rounded-sm bg-leaf" />
            Paid
          </span>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-ink-medium">
            <span className="w-2.5 h-2.5 rounded-sm bg-turmeric" />
            Processing
          </span>
        </div>
      </section>

      {/* Payment ledger */}
      <section>
        <h2 className="font-display font-bold text-lg text-ink mb-3 px-1">Payment history</h2>
        <div className="card-warm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-paper-dark/70 bg-paper/50">
                  <th className="text-left font-semibold text-[11px] uppercase tracking-wide text-ink-medium px-4 py-3">
                    Shift
                  </th>
                  <th className="text-left font-semibold text-[11px] uppercase tracking-wide text-ink-medium px-4 py-3 hidden sm:table-cell">
                    Vendor
                  </th>
                  <th className="text-left font-semibold text-[11px] uppercase tracking-wide text-ink-medium px-4 py-3">
                    Date
                  </th>
                  <th className="text-right font-semibold text-[11px] uppercase tracking-wide text-ink-medium px-4 py-3">
                    Amount
                  </th>
                  <th className="text-right font-semibold text-[11px] uppercase tracking-wide text-ink-medium px-4 py-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-paper-dark/50">
                {shifts.map((shift) => (
                  <tr key={shift.id}>
                    <td className="px-4 py-3 font-semibold text-ink">{shift.title}</td>
                    <td className="px-4 py-3 text-ink-medium hidden sm:table-cell">
                      {shift.vendor}
                    </td>
                    <td className="px-4 py-3 text-ink-medium whitespace-nowrap">{shift.date}</td>
                    <td className="px-4 py-3 text-right font-display font-bold text-ink">
                      ₹{shift.pay.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full whitespace-nowrap ${
                          shift.status === 'paid'
                            ? 'bg-leaf-light text-leaf-dark'
                            : 'bg-turmeric-light text-turmeric-dark'
                        }`}
                      >
                        {shift.status === 'paid' ? 'Paid' : 'Processing'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs text-ink-medium mt-3 px-1 flex items-start gap-1.5">
          <Icon name="Info" size={13} className="flex-shrink-0 mt-0.5" />
          Payouts are released to your registered UPI ID within 48 hours of a shift being marked
          complete by the vendor.
        </p>
      </section>
    </PageShell>
  );
};

export default Earnings;
