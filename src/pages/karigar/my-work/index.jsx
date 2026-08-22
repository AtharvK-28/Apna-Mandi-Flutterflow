import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import PageShell from '../../../components/ui/PageShell';
import EmptyState from '../../../components/ui/EmptyState';
import { useWork } from '../../../contexts/WorkContext';

const APPLICATION_STATUS = {
  pending: { label: 'Waiting on vendor', icon: 'Clock', tint: 'bg-turmeric-light text-turmeric-dark' },
  accepted: { label: 'Confirmed', icon: 'CheckCircle', tint: 'bg-leaf-light text-leaf-dark' },
  declined: { label: 'Not this time', icon: 'XCircle', tint: 'bg-chili-light text-chili' },
};

const formatApplied = (iso) => {
  const then = new Date(iso);
  const minutes = Math.round((Date.now() - then.getTime()) / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (minutes < 1440) return `${Math.round(minutes / 60)} hr ago`;
  return then.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
};

const MyWork = () => {
  const { applications, shifts, withdrawApplication } = useWork();
  const [confirmingWithdrawal, setConfirmingWithdrawal] = useState(null);

  const upcoming = shifts.filter((s) => s.status !== 'paid');

  return (
    <PageShell
      title="My work"
      subtitle="Shifts you have applied for, and the ones already on your calendar."
    >
      {/* Applications */}
      <section className="mb-8">
        <h2 className="font-display font-bold text-lg text-ink mb-3 px-1">
          Applications
          {applications.length > 0 && (
            <span className="ml-2 text-xs font-bold text-ink-medium">({applications.length})</span>
          )}
        </h2>

        {applications.length ? (
          <div className="flex flex-col gap-2.5">
            {applications.map((application) => {
              const status = APPLICATION_STATUS[application.status] ?? APPLICATION_STATUS.pending;
              const isConfirming = confirmingWithdrawal === application.id;

              return (
                <article key={application.id} className="card-warm p-4">
                  <div className="flex items-start gap-3">
                    <span
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${status.tint}`}
                    >
                      <Icon name={status.icon} size={18} />
                    </span>

                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-[15px] text-ink leading-snug">
                        {application.gigTitle}
                      </h3>
                      <p className="text-xs text-ink-medium mt-0.5 flex items-center gap-1 flex-wrap">
                        <span className="font-semibold text-ink-light">{application.vendor}</span>
                        <span aria-hidden>·</span>
                        {application.date}, {application.time}
                      </p>
                      <p className="text-[11px] font-semibold text-ink-medium mt-1.5">
                        {status.label} · applied {formatApplied(application.appliedAt)}
                      </p>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="font-display font-extrabold text-lg text-leaf-dark leading-none">
                        ₹{application.totalPay.toLocaleString('en-IN')}
                      </div>
                      <div className="text-[10px] font-semibold text-ink-medium mt-1">
                        {application.duration}
                      </div>
                    </div>
                  </div>

                  {/* Withdrawing frees the slot for someone else, so it asks first. */}
                  <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-paper-dark/60">
                    {isConfirming ? (
                      <>
                        <span className="text-xs text-ink-medium mr-auto">
                          Withdraw this application?
                        </span>
                        <button
                          type="button"
                          onClick={() => setConfirmingWithdrawal(null)}
                          className="press text-xs font-bold text-ink-light px-3 py-1.5 rounded-lg hover:bg-paper-dark/50 transition-colors"
                        >
                          Keep it
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            withdrawApplication(application.id);
                            setConfirmingWithdrawal(null);
                          }}
                          className="press text-xs font-bold text-white bg-chili px-3 py-1.5 rounded-lg hover:brightness-95 transition"
                        >
                          Withdraw
                        </button>
                      </>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setConfirmingWithdrawal(application.id)}
                        className="press text-xs font-bold text-ink-medium hover:text-chili transition-colors"
                      >
                        Withdraw
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon="ClipboardList"
            title="No applications yet"
            description="When you apply for a shift it shows up here, along with whether the vendor has confirmed you."
            action={
              <Link
                to="/karigar/find-work"
                className="press inline-flex items-center gap-2 text-sm font-bold text-white bg-terracotta px-4 py-2.5 rounded-xl hover:bg-terracotta-dark transition-colors"
              >
                <Icon name="Search" size={15} />
                Find work near you
              </Link>
            }
          />
        )}
      </section>

      {/* Upcoming and recent shifts */}
      <section>
        <h2 className="font-display font-bold text-lg text-ink mb-3 px-1">Recent shifts</h2>

        {upcoming.length > 0 && (
          <div className="card-warm p-3.5 mb-3 flex items-center gap-3 border-l-4 border-l-turmeric">
            <span className="w-9 h-9 rounded-xl bg-turmeric-light text-turmeric-dark flex items-center justify-center flex-shrink-0">
              <Icon name="Hourglass" size={16} />
            </span>
            <p className="text-sm text-ink-light">
              <span className="font-bold text-ink">
                ₹{upcoming.reduce((sum, s) => sum + s.pay, 0).toLocaleString('en-IN')}
              </span>{' '}
              is being processed from {upcoming.length}{' '}
              {upcoming.length === 1 ? 'shift' : 'shifts'}. Payouts land within 48 hours of a shift
              ending.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2.5">
          {shifts.map((shift) => (
            <div key={shift.id} className="card-warm p-4 flex items-center gap-3">
              <span
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  shift.status === 'paid'
                    ? 'bg-leaf-light text-leaf-dark'
                    : 'bg-turmeric-light text-turmeric-dark'
                }`}
              >
                <Icon name={shift.status === 'paid' ? 'CheckCircle' : 'Hourglass'} size={18} />
              </span>

              <div className="min-w-0 flex-1">
                <h3 className="font-bold text-[15px] text-ink truncate">{shift.title}</h3>
                <p className="text-xs text-ink-medium mt-0.5">
                  {shift.vendor} · {shift.date} · {shift.hours} hrs
                </p>
              </div>

              <div className="text-right flex-shrink-0">
                <div className="font-display font-extrabold text-lg text-leaf-dark leading-none">
                  ₹{shift.pay.toLocaleString('en-IN')}
                </div>
                <div className="flex items-center justify-end gap-0.5 mt-1">
                  {shift.rating ? (
                    <>
                      <Icon name="Star" size={11} className="text-turmeric-dark" />
                      <span className="text-[10px] font-semibold text-ink-medium">
                        {shift.rating}.0
                      </span>
                    </>
                  ) : (
                    <span className="text-[10px] font-semibold text-ink-medium">Not rated</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </PageShell>
  );
};

export default MyWork;
