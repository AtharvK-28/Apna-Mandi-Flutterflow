import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { COMPLETED_SHIFTS, GIGS } from '../data/gigs';
import { KARIGARS } from '../data/karigars';

// Karigar Connect has two sides: a vendor posting work and a karigar taking it.
// Both need to agree on the same gigs, applications and messages, and they live
// on different routes now, so the state sits above them rather than inside a
// single page component.

const WorkContext = createContext(null);

export const useWork = () => {
  const context = useContext(WorkContext);
  if (!context) throw new Error('useWork must be used within a WorkProvider');
  return context;
};

export const WorkProvider = ({ children }) => {
  const [gigs, setGigs] = useState(GIGS);
  const [karigars, setKarigars] = useState(KARIGARS);
  const [applications, setApplications] = useState([]);
  const [messages, setMessages] = useState([]);
  const [shifts] = useState(COMPLETED_SHIFTS);

  const postGig = useCallback((gig) => {
    const record = {
      ...gig,
      id: `G-${Date.now()}`,
      applicants: 0,
      status: 'open',
      postedAt: 'Just now',
    };
    setGigs((prev) => [record, ...prev]);
    return record;
  }, []);

  const registerKarigar = useCallback((profile) => {
    const record = { ...profile, id: `K-${Date.now()}`, totalGigs: 0, rating: null, online: true };
    setKarigars((prev) => [record, ...prev]);
    return record;
  }, []);

  const applyForGig = useCallback(
    (gig) => {
      // Applying twice to the same gig is a misclick, not an intent — ignore it.
      if (applications.some((a) => a.gigId === gig.id)) return null;

      const application = {
        id: `A-${Date.now()}`,
        gigId: gig.id,
        gigTitle: gig.title,
        vendor: gig.vendor,
        vendorLocation: gig.vendorLocation,
        appliedAt: new Date().toISOString(),
        status: 'pending',
        totalPay: gig.totalPay,
        date: gig.date,
        time: gig.time,
        duration: gig.duration,
      };
      setApplications((prev) => [application, ...prev]);
      setGigs((prev) =>
        prev.map((g) => (g.id === gig.id ? { ...g, applicants: g.applicants + 1 } : g)),
      );
      return application;
    },
    [applications],
  );

  const withdrawApplication = useCallback((applicationId) => {
    setApplications((prev) => {
      const target = prev.find((a) => a.id === applicationId);
      if (target) {
        setGigs((gs) =>
          gs.map((g) =>
            g.id === target.gigId ? { ...g, applicants: Math.max(0, g.applicants - 1) } : g,
          ),
        );
      }
      return prev.filter((a) => a.id !== applicationId);
    });
  }, []);

  const sendMessage = useCallback((recipient, body) => {
    const message = {
      id: `M-${Date.now()}`,
      recipientId: recipient.id,
      recipientName: recipient.name ?? recipient.vendor,
      body,
      sentAt: new Date().toISOString(),
      status: 'sent',
    };
    setMessages((prev) => [message, ...prev]);
    return message;
  }, []);

  const hasAppliedTo = useCallback(
    (gigId) => applications.some((a) => a.gigId === gigId),
    [applications],
  );

  const earnings = useMemo(() => {
    const paid = shifts.filter((s) => s.status === 'paid');
    const pending = shifts.filter((s) => s.status !== 'paid');
    const totalHours = shifts.reduce((sum, s) => sum + s.hours, 0);
    const totalPaid = paid.reduce((sum, s) => sum + s.pay, 0);
    const rated = shifts.filter((s) => typeof s.rating === 'number');

    return {
      totalPaid,
      pendingAmount: pending.reduce((sum, s) => sum + s.pay, 0),
      shiftCount: shifts.length,
      totalHours,
      // Averaging pay-per-hour across all shifts, not per-shift rates, so a long
      // cheap shift doesn't read the same as a short expensive one.
      averagePerHour: totalHours ? Math.round(totalPaid / totalHours) : 0,
      averageRating: rated.length
        ? Number((rated.reduce((sum, s) => sum + s.rating, 0) / rated.length).toFixed(1))
        : null,
    };
  }, [shifts]);

  const value = useMemo(
    () => ({
      gigs,
      karigars,
      applications,
      messages,
      shifts,
      earnings,
      postGig,
      registerKarigar,
      applyForGig,
      withdrawApplication,
      sendMessage,
      hasAppliedTo,
    }),
    [
      applyForGig,
      applications,
      earnings,
      gigs,
      hasAppliedTo,
      karigars,
      messages,
      postGig,
      registerKarigar,
      sendMessage,
      shifts,
      withdrawApplication,
    ],
  );

  return <WorkContext.Provider value={value}>{children}</WorkContext.Provider>;
};
