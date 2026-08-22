import React from 'react';
import Icon from '../../../components/AppIcon';
import QrPattern from '../../../components/QrPattern';

// Level is earned from verified platform activity, not self-declared
export const hunarLevel = (karigar) => {
  if (karigar.totalGigs >= 80) return 4;
  if (karigar.totalGigs >= 40) return 3;
  if (karigar.totalGigs >= 25) return 2;
  return 1;
};

export const HunarBadge = ({ karigar, onClick }) => {
  const skill = karigar.verifiedSkills?.[0];
  if (!skill) return null;
  return (
    <button
      onClick={onClick}
      className="font-semibold text-[11px] text-white bg-leaf-dark hover:bg-leaf transition-colors px-2.5 py-1 rounded-lg flex items-center gap-1"
      title="View Hunar certificate"
    >
      <Icon name="Award" size={11} />
      Hunar L{hunarLevel(karigar)} · {skill}
    </button>
  );
};

export const HunarCertificateModal = ({ karigar, onClose }) => {
  if (!karigar) return null;
  const level = hunarLevel(karigar);
  const skill = karigar.verifiedSkills?.[0] || karigar.skills?.[0];
  const certId = `HNR-2026-${String(karigar.id).padStart(4, '0')}`;

  const evidence = [
    { icon: 'CheckCircle', label: `${karigar.totalGigs} gigs completed & paid on Apna Mandi`, sub: 'Every gig verified by a real vendor transaction' },
    { icon: 'Star', label: `${karigar.rating} average vendor rating`, sub: 'Collected after each completed shift' },
    { icon: 'Video', label: 'Video skill assessment passed', sub: `Live ${skill?.toLowerCase()} test, reviewed Mar 2026` }
  ];

  const unlocks = [
    { icon: 'TrendingUp', label: 'Certified rate tier — earns above corridor average' },
    ...(level >= 3
      ? [{ icon: 'Store', label: 'Eligible to run Cart Franchise training gigs' }]
      : [{ icon: 'Lock', label: `Reach Level 3 (40+ gigs) to unlock franchise training gigs` }])
  ];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Certificate header */}
        <div className="relative bg-gradient-to-br from-leaf-dark to-leaf text-white px-6 py-5 rounded-t-2xl">
          <button onClick={onClose} className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white/10 transition-colors">
            <Icon name="X" size={18} />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/15 border border-white/40 rounded-full flex items-center justify-center flex-shrink-0">
              <Icon name="Award" size={24} />
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-widest opacity-80">Hunar Certified · Level {level}</p>
              <h2 className="text-lg font-bold leading-tight">{skill}</h2>
              <p className="text-xs opacity-80">{karigar.name} · {karigar.location}</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">
          {/* Evidence — the point: transaction-backed, not self-declared */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Earned from verified work, not a form
            </p>
            <div className="space-y-2.5">
              {evidence.map((item) => (
                <div key={item.label} className="flex items-start gap-2.5">
                  <Icon name={item.icon} size={15} className="text-leaf-dark mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-card-foreground font-medium">{item.label}</p>
                    <p className="text-xs text-muted-foreground">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Unlocks */}
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              What this certificate unlocks
            </p>
            <div className="space-y-2">
              {unlocks.map((item) => (
                <div key={item.label} className="flex items-center gap-2.5">
                  <Icon name={item.icon} size={15} className={item.icon === 'Lock' ? 'text-muted-foreground' : 'text-primary'} />
                  <p className="text-sm text-card-foreground">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Verification footer */}
          <div className="flex items-center gap-4 bg-muted rounded-xl p-3">
            <div className="bg-white p-1.5 rounded-lg flex-shrink-0">
              <QrPattern seed={certId} size={72} />
            </div>
            <div>
              <p className="text-xs font-medium text-card-foreground">Certificate {certId}</p>
              <p className="text-xs text-muted-foreground">
                Scan to verify — aligned with Skill India / PMKVY recognition of informal culinary skills
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
